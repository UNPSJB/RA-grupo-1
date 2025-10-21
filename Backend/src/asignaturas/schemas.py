from pydantic import BaseModel, field_validator
from typing import Optional

class AsignaturaBase(BaseModel):
    nombre: str
    matricula: str
    
    @field_validator('nombre')
    def nombre_no_vacio(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre no puede estar vacío')
        return v.strip()
    
    @field_validator('matricula')
    def matricula_no_vacia(cls, v):
        if not v or not v.strip():
            raise ValueError('La matrícula no puede estar vacía')
        return v.strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "nombre": "Sistemas y organizaciones",
                "matricula": "FA02",
            }
        }
    }

class AsignaturaCreate(AsignaturaBase):
    """Schema para crear una nueva asignatura"""
    pass

class Asignatura(AsignaturaBase):
    id: int
    model_config = {"from_attributes": True}