from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from pydantic import field_validator
class CicloBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    activo: Optional[bool] = False

class CicloCreate(CicloBase):
    pass

class CicloUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    activo: Optional[bool] = None

    @field_validator("fecha_inicio", "fecha_fin", mode="before")
    def parse_date(cls, v):
        if v in ("", None):
            return None
        return v

class CicloOut(CicloBase):
    id: int
    creado_en: Optional[datetime] = None

    class Config:
        from_attributes = True  