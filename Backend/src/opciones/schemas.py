from pydantic import BaseModel, field_validator
from src.opciones import exceptions

class OpcionBase(BaseModel):
    texto: str

    @field_validator('texto')
    @classmethod
    def validar_texto_no_vacio(cls, v):
        if not v or not v.strip():
            raise exceptions.TextoOpcionVacioError("El texto de la opción no puede estar vacío")
        if len(v.strip()) > 100:
            raise exceptions.TextoOpcionDemasiadoLargoError("El texto no puede exceder los 100 caracteres")
        return v.strip()

class OpcionCreate(OpcionBase):
    pass

class OpcionUpdate(OpcionBase):
    pass

class OpcionDelete(BaseModel):
    id: int

class Opcion(OpcionBase):
    id: int

    model_config = {
        "from_attributes": True
    } 