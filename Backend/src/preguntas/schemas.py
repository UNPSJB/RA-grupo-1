from pydantic import BaseModel, field_validator, Field
from src.preguntas import exceptions
from typing import List, Optional
from src.opciones import schemas as opcion_schemas

class PreguntaBase(BaseModel):
    texto: str
    tipo: Optional[str] = None 
    
class PreguntaCerradaCreate(PreguntaBase):
    categoria_id: int
    encuesta_id: int
    texto: str
    opcion_ids: List[int] = Field(..., min_length=1)

    @field_validator("opcion_ids")
    @classmethod
    def validar_minimo_opciones(cls, v):
        if not v or len(v) < 1:
            raise ValueError("La pregunta tiene que tener una opción")
        return v

class Pregunta(PreguntaBase):
    id: int
    texto: str
    categoria_id: Optional[int] = None

    model_config = {"from_attributes": True}


class PreguntaCerrada(Pregunta):
    opciones: List[opcion_schemas.Opcion]

    model_config = {"from_attributes": True}

# Pregunta Abierta
class PreguntaAbiertaCreate(PreguntaBase):
    categoria_id: Optional[int] = None
    encuesta_id: int
    texto: str

# Pregunta abierta (sin opciones).
class PreguntaAbierta(Pregunta):
    model_config = {"from_attributes": True}

class CrearPreguntaCerrada(BaseModel):
    texto: str
    tipo: str
    encuesta_id: int
    opciones: List[int]  

class CrearPreguntaAbierta(BaseModel):
    texto: str
    tipo: str
    encuesta_id: int

class PreguntaUpdate(BaseModel):
    texto: Optional[str] = None
    tipo: Optional[str] = None

class PreguntaDelete(BaseModel):
    id: int
    mensaje: str = "Pregunta eliminada correctamente"
