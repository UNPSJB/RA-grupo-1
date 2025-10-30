from pydantic import BaseModel
#from datetime import datetime
from typing import List
from src.respuestas.schemas import Respuesta, RespuestaCreateEnEncuesta
from src.vinculaciones.models import Duracion

class EncuestaFinalizadaBase(BaseModel):
    alumno_id: int
    encuesta_id: int
    asignatura_id: int
    anio: int
    duracion: Duracion

class EncuestaFinalizadaCreate(EncuestaFinalizadaBase):
    pass

class EncuestaFinalizadaConRespuestasCreate(EncuestaFinalizadaBase):
    respuestas: List[RespuestaCreateEnEncuesta]

class EncuestaFinalizada(EncuestaFinalizadaBase):
    id: int
    #fecha_finalizada: datetime
    respuestas: List[Respuesta]

    model_config = {"from_attributes": True}