from pydantic import BaseModel, EmailStr
from typing import List

class AlumnoBase(BaseModel):
    nombre: str
    email: EmailStr


class AlumnoCreate(AlumnoBase):
    pass


class AlumnoUpdate(AlumnoBase):
    pass


class Alumno(AlumnoBase):
    id: int

    model_config = {"from_attributes": True}