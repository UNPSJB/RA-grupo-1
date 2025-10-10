from pydantic import BaseModel, ConfigDict ,field_validator
from typing import List, Optional
from datetime import datetime
from enum import StrEnum

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    telefono: Optional[str] = None
    roles: str

class Persona(PersonaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class DocenteBase(BaseModel):
    persona_id: int
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "persona_id": 1
            }
        }
    )

class DocenteCreate(DocenteBase):
    pass

class Docente(DocenteBase):
    id: int
    persona: Persona  # Incluye datos de la persona
    
    model_config = ConfigDict(from_attributes=True)

class DocenteConAsignaturas(Docente):
    """Extiende Docente con información de asignaturas"""
    asignaturas_asociadas: List['AsignaturaInfo'] = []
    
    model_config = ConfigDict(from_attributes=True)
class AsignaturaInfo(BaseModel):
    id: int
    nombre: str
    matricula: str
    duracion: str
    
    model_config = ConfigDict(from_attributes=True)

class AsignaturaDocenteInfo(BaseModel):
    """Información de asignatura con detalles de la relación"""
    asignatura: AsignaturaInfo
    duracion: str
    
    model_config = ConfigDict(from_attributes=True)

# Enums
class EstadoEncuesta(StrEnum):
    abierta = "abierta"
    cerrada = "cerrada"

class DuracionAsignatura(StrEnum):
    anual = "anual"
    semestral = "semestral"
    cuatrimestral = "cuatrimestral"



class EncuestaDocenteResumen(BaseModel):
    id: int
    titulo: str
    asignatura_nombre: str
    asignatura_id: int
    estado: EstadoEncuesta
    fecha_inicio: datetime
    fecha_fin: datetime
    activa: bool
    carrera: str
    cursado: str
    anio: int
    sede: str
    total_alumnos: Optional[int] = 0  
    total_respuestas: Optional[int] = 0  
    
    model_config = ConfigDict(from_attributes=True)

class AsignaturaConEncuestas(BaseModel):
    asignatura_id: int
    asignatura_nombre: str
    matricula: str
    duracion: str
    anio: int
    encuestas: List[EncuestaDocenteResumen]
    
    model_config = {"from_attributes": True}

class DocenteResponse(BaseModel):
    """Response model para endpoints de docente"""
    id: int
    persona: Persona
    asignaturas_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)

class AsignacionAsignaturaResponse(BaseModel):
    """Response para asignación de asignatura"""
    mensaje: str
    docente_id: int
    asignatura_id: int
    duracion: str
    
    model_config = ConfigDict(from_attributes=True)

class DocenteListResponse(BaseModel):
    """Response para lista de docentes"""
    docentes: List[DocenteResponse]
    total: int
    
    model_config = ConfigDict(from_attributes=True)

@field_validator('roles')
def validar_roles(cls, v):
    roles_permitidos = ['Alumno', 'Docente', 'Administrador']
    if v:
        roles = [r.strip() for r in v.split(',')]
        for rol in roles:
            if rol not in roles_permitidos:
                raise ValueError(f'Rol no permitido: {rol}')
    return v