from pydantic import BaseModel, EmailStr
from typing import List

class PersonaBase(BaseModel):
    nombre: str
    email: EmailStr

class PersonaCreate(PersonaBase):
    pass

class PersonaUpdate(PersonaBase):
    pass

class Persona(PersonaBase):
    id: int

    class Config:
        orm_mode = True
