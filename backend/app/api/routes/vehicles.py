import logging
import re

import httpx
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from postgrest.exceptions import APIError
from storage3.exceptions import StorageException

from app.api.dependencies import get_admin_user_id, get_authenticated_user_id
from app.core.config import get_settings
from app.core.database import get_supabase_client
from app.models.vehicle import VehicleRecord
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.auth import MessageResponse
from app.schemas.vehicle import VehicleImageResponse, VehicleInput, VehicleResponse
from app.services.vehicle_service import VehicleNotFoundError, VehicleService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/vehicles", tags=["Vehículos"])
MAX_VEHICLE_IMAGE_BYTES = 5 * 1024 * 1024
IMAGE_FORMATS = {
    "image/jpeg": ("jpg", lambda content: content.startswith(b"\xff\xd8\xff")),
    "image/png": (
        "png",
        lambda content: content.startswith(b"\x89PNG\r\n\x1a\n"),
    ),
    "image/webp": (
        "webp",
        lambda content: len(content) >= 12
        and content.startswith(b"RIFF")
        and content[8:12] == b"WEBP",
    ),
}


def get_vehicle_service() -> VehicleService:
    return VehicleService(VehicleRepository(get_supabase_client()))


def _database_error(error: Exception) -> HTTPException:
    logger.exception("Vehicle database request failed.")
    if isinstance(error, APIError) and getattr(error, "code", None) == "23505":
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un vehículo registrado con esa placa.",
        )
    if isinstance(error, APIError) and getattr(error, "code", None) == "23503":
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Uno de los IDs de modelo, sucursal, categoría o seguro no existe.",
        )
    if isinstance(error, APIError):
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo consultar la tabla vehiculo. Revisa sus columnas y relaciones.",
        )
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="No se pudo conectar con Supabase.",
    )


def _to_response(vehicle: VehicleRecord) -> VehicleResponse:
    return VehicleResponse(
        placa=vehicle.placa,
        anio=vehicle.anio,
        color=vehicle.color,
        kilometraje_actual=vehicle.kilometraje_actual,
        monto_garantia=vehicle.monto_garantia,
        sector_estacionamiento=vehicle.sector_estacionamiento,
        estado=vehicle.estado,
        id_modelo=vehicle.id_modelo,
        id_sucursal=vehicle.id_sucursal,
        id_categoria=vehicle.id_categoria,
        id_seguro=vehicle.id_seguro,
        imagen_url=vehicle.imagen_url,
        marca=vehicle.marca,
        modelo=vehicle.modelo,
        categoria=vehicle.categoria,
        sucursal=vehicle.sucursal,
    )


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(
    _: int = Depends(get_authenticated_user_id),
    service: VehicleService = Depends(get_vehicle_service),
) -> list[VehicleResponse]:
    try:
        return [_to_response(vehicle) for vehicle in service.list_vehicles()]
    except APIError as error:
        raise _database_error(error) from error
    except httpx.HTTPError as error:
        raise _database_error(error) from error


@router.post("/{plate}/image", response_model=VehicleImageResponse)
async def upload_vehicle_image(
    plate: str,
    file: UploadFile = File(...),
    _: int = Depends(get_admin_user_id),
    service: VehicleService = Depends(get_vehicle_service),
) -> VehicleImageResponse:
    normalized_plate = plate.strip().upper()
    if not re.fullmatch(r"[A-Z0-9-]{1,20}", normalized_plate):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="La placa no tiene un formato válido.",
        )

    content_type = file.content_type or ""
    image_format = IMAGE_FORMATS.get(content_type)
    if image_format is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="La foto debe estar en formato JPG, PNG o WebP.",
        )

    content = await file.read(MAX_VEHICLE_IMAGE_BYTES + 1)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo de imagen está vacío.",
        )
    if len(content) > MAX_VEHICLE_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail="La imagen no puede superar los 5 MB.",
        )

    extension, signature_check = image_format
    if not signature_check(content):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="El contenido del archivo no coincide con su formato de imagen.",
        )

    try:
        image_url = service.store_image(
            plate=normalized_plate,
            content=content,
            extension=extension,
            content_type=content_type,
            bucket_name=get_settings().vehicle_images_bucket,
        )
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el vehículo para guardar su imagen.",
        ) from error
    except APIError as error:
        raise _database_error(error) from error
    except httpx.HTTPError as error:
        raise _database_error(error) from error
    except StorageException as error:
        logger.exception("Could not upload vehicle image to Supabase Storage.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo guardar la foto. Confirma que el bucket público 'vehiculos' exista y que el backend tenga acceso.",
        ) from error
    return VehicleImageResponse(imagen_url=image_url)


@router.delete("/{plate}", response_model=MessageResponse)
def delete_vehicle(
    plate: str,
    _: int = Depends(get_admin_user_id),
    service: VehicleService = Depends(get_vehicle_service),
) -> MessageResponse:
    try:
        service.delete_vehicle(plate.strip().upper())
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el vehículo que deseas eliminar.",
        ) from error
    except APIError as error:
        if getattr(error, "code", None) == "23503":
            logger.info("Vehicle %s cannot be deleted because it has related records.", plate)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="No se puede eliminar: el vehículo tiene reservas, tarifas, mantenimientos, incidentes u otros registros asociados.",
            ) from error
        raise _database_error(error) from error
    except httpx.HTTPError as error:
        raise _database_error(error) from error
    return MessageResponse(message="Vehículo eliminado correctamente.")


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    request: VehicleInput,
    _: int = Depends(get_admin_user_id),
    service: VehicleService = Depends(get_vehicle_service),
) -> VehicleResponse:
    try:
        return _to_response(
            service.create_vehicle(request.model_dump())
        )
    except APIError as error:
        raise _database_error(error) from error
    except httpx.HTTPError as error:
        raise _database_error(error) from error


@router.put("/{plate}", response_model=VehicleResponse)
def update_vehicle(
    plate: str,
    request: VehicleInput,
    _: int = Depends(get_admin_user_id),
    service: VehicleService = Depends(get_vehicle_service),
) -> VehicleResponse:
    if request.placa != plate.strip().upper():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="La placa no se puede cambiar al editar un vehículo.",
        )
    try:
        return _to_response(service.update_vehicle(plate.strip().upper(), request.model_dump()))
    except VehicleNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el vehículo que deseas editar.",
        ) from error
    except APIError as error:
        raise _database_error(error) from error
    except httpx.HTTPError as error:
        raise _database_error(error) from error
