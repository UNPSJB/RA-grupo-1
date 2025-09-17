from pydantic import BaseModel

class PersonaBase(BaseModel):
    nombre: str
    edad: int
    correo: str

class PersonaCreate(PersonaBase):
    pass

class PersonaUpdate(PersonaBase):
    pass

class Persona(PersonaBase):
    id: int

    class Config:
        orm_mode = True
