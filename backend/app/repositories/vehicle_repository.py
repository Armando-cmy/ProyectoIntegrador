import logging
from typing import Any
from uuid import uuid4

import httpx
from postgrest.exceptions import APIError
from storage3.exceptions import StorageException
from supabase import Client

from app.models.vehicle import VehicleRecord

logger = logging.getLogger(__name__)

VEHICLE_COLUMNS = (
    "placa,anio,color,kilometraje_actual,monto_garantia,"
    "sector_estacionamiento,estado,id_modelo,id_sucursal,id_categoria,"
    "id_seguro,imagen_url,modelo!vehiculo_id_modelo_fkey(nombre,marca),"
    "categoria!vehiculo_id_categoria_fkey(nombre),"
    "sucursal!vehiculo_id_sucursal_fkey(nombre)"
)


class VehicleRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def list_vehicles(self) -> list[VehicleRecord]:
        result = (
            self.client.table("vehiculo")
            .select(VEHICLE_COLUMNS)
            .order("placa")
            .execute()
        )
        return [self._to_record(row) for row in result.data or []]

    def create_vehicle(self, values: dict[str, Any]) -> VehicleRecord:
        result = (
            self.client.table("vehiculo")
            .insert(values)
            .select(VEHICLE_COLUMNS)
            .single()
            .execute()
        )
        return self._to_record(result.data)

    def update_vehicle(self, plate: str, values: dict[str, Any]) -> VehicleRecord | None:
        result = (
            self.client.table("vehiculo")
            .update(values)
            .eq("placa", plate)
            .select(VEHICLE_COLUMNS)
            .execute()
        )
        if not result.data:
            return None
        return self._to_record(result.data[0])

    def delete_vehicle(self, plate: str) -> bool:
        result = (
            self.client.table("vehiculo")
            .delete()
            .eq("placa", plate)
            .select("placa")
            .execute()
        )
        return bool(result.data)

    def store_image(
        self,
        plate: str,
        content: bytes,
        extension: str,
        content_type: str,
        bucket_name: str,
    ) -> str:
        object_path = f"{plate}/{uuid4().hex}.{extension}"
        bucket = self.client.storage.from_(bucket_name)
        bucket.upload(
            object_path,
            content,
            {"content-type": content_type, "upsert": "false"},
        )
        public_url = bucket.get_public_url(object_path)
        try:
            result = (
                self.client.table("vehiculo")
                .update({"imagen_url": public_url})
                .eq("placa", plate)
                .select("placa")
                .execute()
            )
        except (APIError, httpx.HTTPError):
            self._remove_uploaded_image(bucket, object_path)
            raise

        if not result.data:
            self._remove_uploaded_image(bucket, object_path)
            return ""
        return public_url

    @staticmethod
    def _remove_uploaded_image(bucket, object_path: str) -> None:
        try:
            bucket.remove([object_path])
        except (StorageException, httpx.HTTPError):
            logger.warning(
                "Could not clean up uploaded vehicle image %s.",
                object_path,
                exc_info=True,
            )

    @staticmethod
    def _to_record(row: dict[str, Any]) -> VehicleRecord:
        model = row["modelo"]
        category = row["categoria"]
        branch = row["sucursal"]
        return VehicleRecord(
            placa=str(row["placa"]),
            anio=int(row["anio"]) if row.get("anio") is not None else None,
            color=str(row["color"]) if row.get("color") is not None else None,
            kilometraje_actual=(
                int(row["kilometraje_actual"])
                if row.get("kilometraje_actual") is not None
                else None
            ),
            monto_garantia=(
                float(row["monto_garantia"])
                if row.get("monto_garantia") is not None
                else None
            ),
            sector_estacionamiento=(
                str(row["sector_estacionamiento"])
                if row.get("sector_estacionamiento") is not None
                else None
            ),
            estado=str(row["estado"]) if row.get("estado") is not None else None,
            id_modelo=int(row["id_modelo"]),
            id_sucursal=int(row["id_sucursal"]),
            id_categoria=int(row["id_categoria"]),
            id_seguro=int(row["id_seguro"]) if row.get("id_seguro") is not None else None,
            imagen_url=str(row["imagen_url"]) if row.get("imagen_url") else None,
            marca=str(model["marca"]),
            modelo=str(model["nombre"]),
            categoria=str(category["nombre"]),
            sucursal=str(branch["nombre"]),
        )
