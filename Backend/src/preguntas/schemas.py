from pydantic import BaseModel
from typing import List, Optional
from src.opciones.schemas import Opcion

class PreguntaBase(BaseModel):
    texto: str
    tipo: Optional[str] = None

class CrearPreguntaAbierta(PreguntaBase):
    tipo : str = "Abierta"

class CrearPreguntaCerrada(PreguntaBase):
    opciones: list[int]  
    tipo :str = "Cerrada"

class PreguntaUpdate(PreguntaBase):
    pass

class PreguntaDelete(BaseModel):
    id: int

class Pregunta(PreguntaBase):
    id: int
    opciones: List[Opcion] = []

    model_config = {
        "from_attributes": True 
    }