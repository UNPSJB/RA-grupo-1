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
        field_name = info.field_name
        
        if info.data.get('rol_id') == 2:  # Si es alumno
            if field_name == 'CUIL' and not v:
                raise ValueError('El CUIL es obligatorio para alumnos')
            if field_name == 'usuario' and not v:
                raise ValueError('El usuario es obligatorio para alumnos')
            if field_name == 'clave' and not v:
                raise ValueError('La clave es obligatoria para alumnos')
        return v

class PersonaUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    dni: Optional[str] = None
    rol_id: Optional[int] = None
    legajo: Optional[int] = None
    
    @field_validator('dni')
    @classmethod
    def validar_dni(cls, v):
        if v is not None:  
            if not v.isdigit():
                raise ValueError('El DNI tiene que tener solo números')
            if len(v) < 7 or len(v) > 10:
                raise ValueError('El DNI debe tener entre 7 y 10 dígitos')
        return v

    @field_validator('rol_id')
    @classmethod
    def validar_rol_id(cls, v):
        if v not in [1, 2]:
            raise ValueError('El rol_id debe ser 1 = Docente o 2 = Alumno')
        return v

class Persona(PersonaBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
