from dataclasses import dataclass


@dataclass(frozen=True)
class VehicleRecord:
    placa: str
    anio: int | None
    color: str | None
    kilometraje_actual: int | None
    monto_garantia: float | None
    sector_estacionamiento: str | None
    estado: str | None
    id_modelo: int
    id_sucursal: int
    id_categoria: int
    id_seguro: int | None
    imagen_url: str | None
    marca: str
    modelo: str
    categoria: str
    sucursal: str
