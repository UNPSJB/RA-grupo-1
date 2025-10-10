from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AlumnoBase(BaseModel):
    CUIL: str
    usuario: str

class AlumnoCreate(AlumnoBase):
    persona_id: int
    clave: str


class AlumnoUpdate(BaseModel):
    usuario: Optional[str] = None
    clave: Optional[str] = None
    CUIL: Optional[str] = None


class AlumnoResponse(AlumnoBase):
    id: int
    persona_id: int
    fecha_creacion: datetime
    fecha_actualizacion: Optional[datetime] = None
    
    model_config = {"from_attributes": True}

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr

class AsignaturaBase(BaseModel):
    id: int
    nombre: str
    codigo: str
    
    model_config = {"from_attributes": True}

class EncuestaBase(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    
    model_config = {"from_attributes": True}

class AlumnoConRelaciones(AlumnoResponse):
    persona: PersonaBase
    asignaturas: List[AsignaturaBase] = []
    encuestas: List[EncuestaBase] = []

class EncuestaDisponible(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    fecha_disponible: datetime
    fecha_limite: Optional[datetime] = None
    
    model_config = {"from_attributes": True}

class AlumnoEncuestasDisponibles(BaseModel):
    alumno_id: int
    encuestas: List[EncuestaDisponible] = []