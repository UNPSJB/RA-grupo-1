from pydantic import BaseModel
from typing import Optional
from src.sedes.schemas import Sede as SedeOut


# ESQUEMA PARA CREAR
class DepartamentoBase(BaseModel):
    nombre: str
    sede_id: int
    profesor_a_cargo: Optional[str] = None


# ESQUEMA PARA LEER (OUTPUT)
class DepartamentoOut(BaseModel):
    id: int
    nombre: str
    sede: SedeOut           
    profesor_a_cargo: Optional[str]

    class Config:
        from_attributes = True
