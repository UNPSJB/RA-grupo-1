from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, Union
from pydantic import validator

# Schema base para registro
class RegisterRequest(BaseModel):
    # Datos de persona
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    
    # Datos de usuario
    username: str
    password: str
    
    # Tipo de rol a registrar
    role_type: Literal["alumno", "docente", "departamento", "secretaria"]
    
    # Campos opcionales según el rol
    CUIL: Optional[str] = None
    legajo: Optional[int] = None
    departamento_id: Optional[int] = None
    
    @validator('CUIL')
    def validate_cuil_for_alumno(cls, v, values):
        if values.get('role_type') == 'alumno' and not v:
            raise ValueError('CUIL es requerido para alumnos')
        return v
    
    @validator('legajo')
    def validate_legajo(cls, v, values):
        role = values.get('role_type')
        if role in ['alumno', 'docente', 'secretaria'] and not v:
            raise ValueError(f'Legajo es requerido para {role}')
        return v
    
    @validator('departamento_id')
    def validate_departamento(cls, v, values):
        if values.get('role_type') == 'departamento' and not v:
            raise ValueError('departamento_id es requerido para usuarios de departamento')
        return v

# Response genérico
class RegisterResponse(BaseModel):
    message: str
    user_id: int
    username: str
    email: str
    role: str
    alumno_id: Optional[int] = None
    docente_id: Optional[int] = None
    departamento_id: Optional[int] = None