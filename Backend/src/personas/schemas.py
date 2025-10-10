from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    rol_id: int
    legajo: int

    @field_validator('dni')
    @classmethod
    def validar_dni(cls, v):
        if not v.isdigit():
            raise ValueError('El DNI tiene que tener solo números')
        if len(v) < 7 or len(v) > 10:
            raise ValueError('El DNI debe tener entre 7 y 10 dígitos')
        return v

    @field_validator('rol_id')
    @classmethod
    def validar_rol_id(cls, v):
        if v not in [1, 2]:
            raise ValueError('El rol_id tiene que ser 1 = Docente o 2 = Alumno')
        return v

class PersonaCreate(PersonaBase):
    # Campos para cuando se crea un alumno
    CUIL: Optional[str] = None
    usuario: Optional[str] = None
    clave: Optional[str] = None

    @field_validator('CUIL', 'usuario', 'clave')
    @classmethod
    def validar_campos_alumno(cls, v, info):
        if info.data.get('rol_id') == 2:  # Si es alumno
            if not v:
                raise ValueError('Los campos CUIL, usuario y clave son obligatorios para alumnos')
        return v

class PersonaUpdate(PersonaBase):
    pass


    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    rol_id: int
    legajo: int
    CUIL: Optional[str] = None
    usuario: Optional[str] = None
    clave: Optional[str] = None

    @field_validator('rol_id')
    @classmethod
    def validar_rol_id(cls, v):
        if v not in [1, 2]:
            raise ValueError('El rol_id debe ser 1 = Docente o 2 = Alumno')
        return v

    @field_validator('CUIL', 'usuario', 'clave')
    @classmethod
    def validar_campos_alumno(cls, v, info):
        if info.data.get('rol_id') == 2:  # Si es alumno
            if not v:
                raise ValueError('Los campos CUIL, usuario y clave son obligatorios para los alumnos')
        return v
class Persona(PersonaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
