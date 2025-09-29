from pydantic import BaseModel
from typing import Optional

class RespuestaCreate(BaseModel):
    estudiante_id: int
    encuesta_id: int
    respuesta_texto: Optional[str] = None
    opcion_multiple: Optional[str] = None

class RespuestaOut(BaseModel):
    id: int
    estudiante_id: int
    encuesta_id: int
    respuesta_texto: Optional[str]
    opcion_multiple: Optional[str]
    progreso: int

    class Config:
        orm_mode = True
