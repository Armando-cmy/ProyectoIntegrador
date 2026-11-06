from pydantic import BaseModel


class UserProfileResponse(BaseModel):
    id_usuario: int
    nombre: str
    usuario: str
    rol: str
    sucursal: str
