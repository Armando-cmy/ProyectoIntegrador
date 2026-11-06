from dataclasses import dataclass


@dataclass(frozen=True)
class CatalogOption:
    id: int
    nombre: str


@dataclass(frozen=True)
class ManagedUser:
    id_usuario: int
    nombre: str
    usuario: str
    rol: str
    sucursal: str
