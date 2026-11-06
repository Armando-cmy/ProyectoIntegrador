from pydantic import BaseModel, Field, field_validator


class VehicleInput(BaseModel):
    placa: str = Field(min_length=1, max_length=20)
    anio: int = Field(ge=1900, le=2100)
    color: str = Field(min_length=1, max_length=60)
    kilometraje_actual: int = Field(ge=0)
    monto_garantia: float = Field(ge=0)
    sector_estacionamiento: str = Field(min_length=1, max_length=100)
    estado: str = Field(min_length=1, max_length=40)
    id_modelo: int = Field(gt=0)
    id_sucursal: int = Field(gt=0)
    id_categoria: int = Field(gt=0)
    id_seguro: int | None = Field(default=None, gt=0)
    imagen_url: str | None = Field(default=None, max_length=2048)

    @field_validator("placa", "color", "sector_estacionamiento", "estado")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Este campo es obligatorio.")
        return value

    @field_validator("placa")
    @classmethod
    def plate_is_normalized(cls, value: str) -> str:
        return value.strip().upper()

    @field_validator("imagen_url")
    @classmethod
    def empty_image_url_is_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class VehicleResponse(BaseModel):
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


class VehicleImageResponse(BaseModel):
    imagen_url: str
