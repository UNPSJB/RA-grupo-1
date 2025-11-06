from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from src.informe_sintetico_finalizado.schemas import InformeSinteticoFinalizado
from src.pregunta_informe_sintetico.schemas import PreguntaInformeSintetico

class InformeSinteticoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    carrera_id: Optional[int] = None
    fecha: date

class InformeSinteticoCreate(InformeSinteticoBase):
    pass

class InformeSintetico(InformeSinteticoBase):
    id: int
    preguntas: List[PreguntaInformeSintetico] = []

    class Config:
        orm_mode = True