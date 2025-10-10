from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from src.opciones.schemas import Opcion
import enum

class TipoPreguntaEnum(str, enum.Enum):
    ABIERTA = "abierta"
    CERRADA = "cerrada"

class PreguntaBase(BaseModel):
    texto: str = Field(..., min_length=1, max_length=250)
    encuesta_id: int
    tipo: TipoPreguntaEnum

class CrearPreguntaAbierta(PreguntaBase):
    tipo: TipoPreguntaEnum = TipoPreguntaEnum.ABIERTA

class CrearPreguntaCerrada(PreguntaBase):
    tipo: TipoPreguntaEnum = TipoPreguntaEnum.CERRADA
    opciones: List[int] = Field(..., min_length=1)

    @field_validator("opciones")
    @classmethod
    def validar_minimo_opciones(cls, v):
        if not v or len(v) < 1:
            raise ValueError("La pregunta cerrada debe tener al menos una opción")
        return 

class PreguntaUpdate(PreguntaBase):
    texto: Optional[str] = Field(None, min_length=1, max_length=250)

class PreguntaDelete(BaseModel):
    id: int

class Pregunta(PreguntaBase):
    id: int
    opciones: List[Opcion] = []

    model_config = {
        "from_attributes": True 
    }