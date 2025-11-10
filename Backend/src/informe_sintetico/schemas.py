from pydantic import BaseModel
from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from src.pregunta_informe_sintetico.schemas import PreguntaInformeSintetico

class InformeSinteticoBase(BaseModel):
    titulo: str
    contenido: str            
    carrera_id: Optional[int] = None
    fecha: date

class InformeSinteticoCreate(InformeSinteticoBase):
    pass

class InformeSintetico(InformeSinteticoBase):
    id: int
    preguntas: List[PreguntaInformeSintetico] = []

    class Config:
        orm_mode = True
