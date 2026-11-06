from app.models.vehicle import VehicleRecord
from app.repositories.vehicle_repository import VehicleRepository


class VehicleNotFoundError(Exception):
    pass


class VehicleService:
    def __init__(self, vehicles: VehicleRepository) -> None:
        self.vehicles = vehicles

    def list_vehicles(self) -> list[VehicleRecord]:
        return self.vehicles.list_vehicles()

    def create_vehicle(self, values: dict[str, object]) -> VehicleRecord:
        return self.vehicles.create_vehicle(values)

    def update_vehicle(self, plate: str, values: dict[str, object]) -> VehicleRecord:
        vehicle = self.vehicles.update_vehicle(plate, values)
        if vehicle is None:
            raise VehicleNotFoundError
        return vehicle

    def delete_vehicle(self, plate: str) -> None:
        if not self.vehicles.delete_vehicle(plate):
            raise VehicleNotFoundError

    def store_image(
        self,
        plate: str,
        content: bytes,
        extension: str,
        content_type: str,
        bucket_name: str,
    ) -> str:
        image_url = self.vehicles.store_image(
            plate=plate,
            content=content,
            extension=extension,
            content_type=content_type,
            bucket_name=bucket_name,
        )
        if not image_url:
            raise VehicleNotFoundError
        return image_url
