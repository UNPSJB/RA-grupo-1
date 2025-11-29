from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    rol_id: int
    legajo: int
    cuil: str

    @field_validator("dni")
    def validar_dni(cls, v):
        if not v.isdigit():
            raise ValueError("El DNI debe contener solo números")
        if len(v) < 7 or len(v) > 10:
            raise ValueError("El DNI debe tener entre 7 y 10 dígitos")
        return v

    @field_validator("rol_id")
    def validar_rol_id(cls, v):
        if v not in [1, 2]:
            raise ValueError("El rol debe ser 1 (Docente) o 2 (Alumno)")
        return v

class PersonaCreate(PersonaBase):
    CUIL: Optional[str] = None
    usuario: Optional[str] = None
    clave: Optional[str] = None

    @field_validator("CUIL", "usuario", "clave")
    def validar_campos_alumno(cls, v, info):
        if info.data.get("rol_id") == 2 and not v:
            raise ValueError(f"El campo {info.field_name} es obligatorio para alumnos")
        return v

class PersonaUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    dni: Optional[str] = None
    rol_id: Optional[int] = None
    legajo: Optional[int] = None
    
    @field_validator("dni")
    def validar_dni(cls, v):
        if v is not None:
            if not v.isdigit():
                raise ValueError("El DNI debe contener solo números")
            if len(v) < 7 or len(v) > 10:
                raise ValueError("El DNI debe tener entre 7 y 10 dígitos")
        return v

    @field_validator("rol_id")
    def validar_rol_id(cls, v):
        if v is None:
            return v
        if v not in [1, 2]:
            raise ValueError("El rol debe ser 1 (Docente) o 2 (Alumno)")
        return v

class Persona(PersonaBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
