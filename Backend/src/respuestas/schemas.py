from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from src.respuestas.models import OpcionRespuesta


class RespuestaBase(BaseModel):
    estudiante_id: int
    encuesta_id: int
    pregunta_id: int
    opcion: Optional[OpcionRespuesta] = None
    valor_numerico: Optional[float] = None
    respondido_at: Optional[datetime] = None


class RespuestaCreate(RespuestaBase):
    pass


class RespuestaUpdate(RespuestaBase):
    pass


class Respuesta(RespuestaBase):
    id: int
    model_config = {"from_attributes": True}