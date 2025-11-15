from pydantic import BaseModel
from enum import Enum as PyEnum

class PreguntaInformeSinteticoBase(BaseModel):
    orden: int
    codigo: str
    oracion: str
    

class PreguntaInformeSinteticoCreate(PreguntaInformeSinteticoBase):
    pass

class PreguntaInformeSintetico(PreguntaInformeSinteticoBase):
    id: int
    informe_base_id: int

    class Config:
        from_attributes = True