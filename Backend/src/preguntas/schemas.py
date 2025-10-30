from pydantic import BaseModel, field_validator, Field
from src.preguntas import exceptions
from typing import List, Optional
from src.opciones import schemas as opcion_schemas

class PreguntaBase(BaseModel):
    oracion: str
    tipo: Optional[str] = None 
    
class PreguntaCerradaCreate(PreguntaBase):
    categoria_id: int
    oracion: str
    opcion_ids: List[int] = Field(..., min_length=1)

    @field_validator("opcion_ids")
    @classmethod
    def validar_minimo_opciones(cls, v):
        if not v or len(v) < 1:
            raise ValueError("La pregunta tiene que tener una opción")
        return v

class Pregunta(PreguntaBase):
    id: int
    oracion: str
    categoria_id: int

    model_config = {"from_attributes": True}


class PreguntaCerrada(Pregunta):
    opciones: List[opcion_schemas.Opcion]

    model_config = {"from_attributes": True}

# Pregunta Abierta
class PreguntaAbiertaCreate(PreguntaBase):
    categoria_id: int
    oracion: str

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
