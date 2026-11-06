import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from postgrest.exceptions import APIError

from app.api.dependencies import get_admin_user_id
from app.core.database import get_supabase_client
from app.repositories.user_management_repository import UserManagementRepository
from app.repositories.user_repository import UserRelationNotFoundError
from app.schemas.auth import MessageResponse
from app.schemas.managed_user import (
    CatalogOptionResponse,
    CreateManagedUserRequest,
    ManagedUserResponse,
    UserManagementOptionsResponse,
)
from app.services.user_management_service import (
    InvalidUserAssignmentError,
    UserManagementService,
    UsernameAlreadyExistsError,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["Usuarios"])


def get_user_management_service() -> UserManagementService:
    return UserManagementService(UserManagementRepository(get_supabase_client()))


def _handle_database_error(error: Exception) -> HTTPException:
    logger.exception("User management database request failed.")
    if isinstance(error, APIError) and getattr(error, "code", None) == "23505":
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese nombre de usuario.",
        )
    if isinstance(error, APIError):
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo consultar la base de datos. Revisa las tablas y permisos.",
        )
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="No se pudo conectar con Supabase.",
    )


@router.get("/options", response_model=UserManagementOptionsResponse)
def get_user_options(
    _: int = Depends(get_admin_user_id),
    service: UserManagementService = Depends(get_user_management_service),
) -> UserManagementOptionsResponse:
    try:
        roles, branches = service.get_options()
    except APIError as error:
        raise _handle_database_error(error) from error
    except httpx.HTTPError as error:
        raise _handle_database_error(error) from error
    return UserManagementOptionsResponse(
        roles=[CatalogOptionResponse(id=item.id, nombre=item.nombre) for item in roles],
        sucursales=[
            CatalogOptionResponse(id=item.id, nombre=item.nombre) for item in branches
        ],
    )


@router.get("", response_model=list[ManagedUserResponse])
def list_users(
    _: int = Depends(get_admin_user_id),
    service: UserManagementService = Depends(get_user_management_service),
) -> list[ManagedUserResponse]:
    try:
        users = service.list_users()
    except APIError as error:
        raise _handle_database_error(error) from error
    except httpx.HTTPError as error:
        raise _handle_database_error(error) from error
    except UserRelationNotFoundError as error:
        logger.error("A managed user refers to a missing role or branch: %s", error)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Hay usuarios con un rol o sucursal que ya no existe.",
        ) from error
    return [
        ManagedUserResponse(
            id_usuario=user.id_usuario,
            nombre=user.nombre,
            usuario=user.usuario,
            rol=user.rol,
            sucursal=user.sucursal,
        )
        for user in users
    ]


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    request: CreateManagedUserRequest,
    _: int = Depends(get_admin_user_id),
    service: UserManagementService = Depends(get_user_management_service),
) -> MessageResponse:
    try:
        service.create_user(
            nombre=request.nombre,
            usuario=request.usuario,
            password=request.password,
            role_id=request.id_rol,
            branch_id=request.id_sucursal,
        )
    except UsernameAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese nombre de usuario.",
        ) from error
    except InvalidUserAssignmentError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error
    except APIError as error:
        raise _handle_database_error(error) from error
    except httpx.HTTPError as error:
        raise _handle_database_error(error) from error
    return MessageResponse(message="Usuario creado correctamente.")
