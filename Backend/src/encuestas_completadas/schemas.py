from pydantic import BaseModel
#from datetime import datetime
from typing import List
from src.respuestas.schemas import Respuesta, RespuestaCreateEnEncuesta
from src.vinculaciones.models import Duracion

class EncuestaCompletadaBase(BaseModel):
    alumno_id: int
    encuesta_id: int
    asignatura_id: int
    anio: int
    duracion: Duracion

class EncuestaCompletadaCreate(EncuestaCompletadaBase):
    pass

class EncuestaCompletadaConRespuestasCreate(EncuestaCompletadaBase):
    respuestas: List[RespuestaCreateEnEncuesta]

class EncuestaCompletada(EncuestaCompletadaBase):
    id: int
    #fecha_completada: datetime
    respuestas: List[Respuesta]

    model_config = {"from_attributes": True}