from dataclasses import dataclass


@dataclass(frozen=True)
class UserRecord:
    id_usuario: int
    nombre: str
    usuario: str
    password: str
    id_rol: int
    id_sucursal: int


@dataclass(frozen=True)
class UserProfile:
    id_usuario: int
    nombre: str
    usuario: str
    rol: str
    sucursal: str
