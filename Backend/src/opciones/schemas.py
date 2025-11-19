from pydantic import BaseModel, field_validator
from src.opciones import exceptions
from typing import Optional

class OpcionBase(BaseModel):
    texto: str

    @field_validator("texto", mode="before")
    @classmethod
    def validar_texto_no_vacio(cls, v):
        if not v or not v.strip():
            raise exceptions.TextoOpcionVacioError("El texto de la opción no puede estar vacío")
        if len(v.strip()) > 100:
            raise exceptions.TextoOpcionDemasiadoLargoError("El texto no puede exceder los 100 caracteres")
        return v.strip()


class OpcionCreate(OpcionBase):
    texto: str
    pregunta_id: int
    pregunta_id: Optional[int] = None


class OpcionUpdate(OpcionBase):
    contenido: str


class OpcionDelete(BaseModel):
    id: int


class Opcion(OpcionBase):
    id: int
    contenido: str
    pregunta_id: int

    model_config = {
        "from_attributes": True
    }
