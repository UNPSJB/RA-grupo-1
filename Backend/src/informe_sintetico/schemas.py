from pydantic import BaseModel
from typing import List, Optional
from src.informe_sintetico_finalizado.schemas import InformeSinteticoFinalizado
from src.pregunta_informe_sintetico.schemas import PreguntaInformeSintetico

class InformeSintetico(BaseModel):
    titulo: str
    descripcion: Optional[str] = None

class InformeSinteticoCreate(InformeSintetico):
    pass

class InformeSintetico(InformeSintetico):
    id: int
    preguntas: List[PreguntaInformeSintetico] = []

    class Config:
        orm_mode = True