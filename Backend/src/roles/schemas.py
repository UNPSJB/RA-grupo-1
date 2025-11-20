from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional

class RolBase(BaseModel):
    nombre: str

class RolCreate(RolBase):
    """Schema para crear un rol"""
    fecha_creacion: Optional[date] = None

class RolUpdate(BaseModel):
    """Schema para actualizar un rol"""
    nombre: Optional[str] = None
    fecha_creacion: Optional[date] = None

class Rol(RolBase):
    id: int
    fecha_creacion: date

    model_config = {"from_attributes": True}