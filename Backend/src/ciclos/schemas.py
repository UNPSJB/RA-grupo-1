from datetime import datetime
from pydantic import BaseModel
from typing import Optional

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

class CicloOut(CicloBase):
    id: int
    creado_en: datetime

    class Config:
        orm_mode = True