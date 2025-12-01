from pydantic import BaseModel
from typing import Optional


class PreguntaInformeSinteticoBase(BaseModel):
    orden: int
    codigo: str
    oracion: str
    estructura: Optional[str] = None   


class PreguntaInformeSinteticoCreate(PreguntaInformeSinteticoBase):
    pass


class PreguntaInformeSintetico(PreguntaInformeSinteticoBase):
    id: int
    informe_base_id: int

    class Config:
        from_attributes = True
