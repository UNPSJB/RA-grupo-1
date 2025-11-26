from pydantic import BaseModel, field_validator, Field
from src.preguntas import exceptions
from typing import List, Optional
from src.preguntas.models import TipoPreguntaEnum
from src.opciones import schemas as opcion_schemas
from src.opciones.schemas import OpcionParaEstudiante

class PreguntaBase(BaseModel):
    texto: str
    tipo: TipoPreguntaEnum = TipoPreguntaEnum.ABIERTA
    categoria_id: Optional[int] = None
    encuesta_id: Optional[int] = None
    informe_id: Optional[int] = None
    nro_pregunta: Optional[int] = Field(default=None, ge=1)

class Pregunta(PreguntaBase):
    id: int

    model_config = {"from_attributes": True}

# Pregunta Cerrada    
class PreguntaCerradaCreate(PreguntaBase):
    tipo: TipoPreguntaEnum = TipoPreguntaEnum.OPCION_MULTIPLE
    opcion_ids: List[int] = Field(..., min_length=1)

    @field_validator("opcion_ids")
    @classmethod
    def validar_minimo_opciones(cls, v):
        if not v or len(v) < 1:
            raise ValueError("La pregunta tiene que tener una opción")
        return v

class PreguntaCerrada(Pregunta):
    opciones: List[opcion_schemas.Opcion] = []

    model_config = {"from_attributes": True}

# Pregunta Abierta
class PreguntaAbiertaCreate(PreguntaBase):
    tipo: TipoPreguntaEnum = TipoPreguntaEnum.ABIERTA

# Pregunta abierta (sin opciones).
class PreguntaAbierta(Pregunta):
    model_config = {"from_attributes": True}

class PreguntaUpdate(BaseModel):
    texto: Optional[str] = None
    tipo: Optional[str] = None
    categoria_id: Optional[int] = None
    encuesta_id: Optional[int] = None
    informe_id: Optional[int] = None
    nro_pregunta: Optional[int] = Field(default=None, ge=1)

class PreguntaDelete(BaseModel):
    id: int
    mensaje: str = "Pregunta eliminada correctamente"

class PreguntaParaEstudiante(BaseModel):
    id: int
    texto: str
    tipo: str
    opciones: List[OpcionParaEstudiante]
