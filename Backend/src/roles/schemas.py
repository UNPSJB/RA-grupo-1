from pydantic import BaseModel
from datetime import date

class RolBase(BaseModel):
    nombre: str

class Rol(RolBase):
    id: int
    fecha_creacion: date

    model_config = {"from_attributes": True}