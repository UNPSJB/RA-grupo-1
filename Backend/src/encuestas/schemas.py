from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EncuestaBase(BaseModel):
    titulo: str
    fecha_inicio: datetime
    fecha_fin: datetime
    activa: bool
    materia_id: int

class EncuestaCreate(EncuestaBase):
    pass

class EncuestaResponse(EncuestaBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class RespuestaCreate(BaseModel):
    estudiante_id: int
    encuesta_id: int
    respuesta_texto: Optional[str] = None

class RespuestaResponse(BaseModel):
    id: int
    estudiante_id: int
    encuesta_id: int
    respuesta_texto: Optional[str]
    progreso: int

    class Config:
        orm_mode = True
