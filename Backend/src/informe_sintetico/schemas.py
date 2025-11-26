from pydantic import BaseModel
from datetime import date

class InformeSinteticoBase(BaseModel):
    titulo: str
    contenido: str
    fecha: date
    carrera_id: int | None = None

class InformeSinteticoCreate(InformeSinteticoBase):
    pass

class InformeSintetico(InformeSinteticoBase):
    id: int

    model_config = {"from_attributes": True}