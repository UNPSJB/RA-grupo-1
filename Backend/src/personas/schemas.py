from pydantic import BaseModel, EmailStr, field_validator
from typing import List

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    rol_id: int
    legajo: int

class PersonaCreate(PersonaBase):
    pass

class PersonaUpdate(PersonaBase):
    pass

class Persona(PersonaBase):
    id: int

    class Config:
        from_attributes = True
