from pydantic import BaseModel, field_validator
from datetime import datetime

class RolBase(BaseModel):
    id: int
    nombre: str
    fecha_creacion: datetime

class RolCreate(RolBase):
    pass

class Rol(RolBase):
    model_config = {"from_attributes": True}