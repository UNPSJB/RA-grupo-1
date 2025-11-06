from pydantic import BaseModel
from enum import Enum as PyEnum

class PreguntaInformeSinteticoBase(BaseModel):
    orden: int
    enunciado: str
    

class PreguntaInformeSinteticoCreate(PreguntaInformeSinteticoBase):
    pass

class PreguntaInformeSintetico(PreguntaInformeSinteticoBase):
    id: int
    informe_base_id: int

    class Config:
        from_attributes = True