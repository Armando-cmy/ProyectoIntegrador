from pydantic import BaseModel, Field, field_validator


class CatalogOptionResponse(BaseModel):
    id: int
    nombre: str


class ManagedUserResponse(BaseModel):
    id_usuario: int
    nombre: str
    usuario: str
    rol: str
    sucursal: str


class UserManagementOptionsResponse(BaseModel):
    roles: list[CatalogOptionResponse]
    sucursales: list[CatalogOptionResponse]


class CreateManagedUserRequest(BaseModel):
    nombre: str = Field(min_length=1, max_length=150)
    usuario: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    id_rol: int = Field(gt=0)
    id_sucursal: int = Field(gt=0)

    @field_validator("nombre", "usuario")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Este campo es obligatorio.")
        return value
