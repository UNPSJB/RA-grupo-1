from pydantic import BaseModel, ConfigDict ,Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import StrEnum
from src.indicadores.schemas import IndicadoresCategoria, OpcionPorcentaje

class PersonaBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    dni: str
    rol_id: int
    legajo: int

class Persona(PersonaBase):
    id: int
    CUIL: Optional[str] = None
    usuario: Optional[str] = None
    clave: Optional[str] = None
    
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
    persona: Persona  
    
    model_config = ConfigDict(from_attributes=True)

class DocenteConAsignaturas(Docente):
    asignaturas_asociadas: List['AsignaturaInfo'] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)

class AsignaturaInfo(BaseModel):
    id: int
    nombre: str
    codigo: str
    
    model_config = ConfigDict(from_attributes=True)

class EstadisticasDocenteResponse(BaseModel):
    promedio_por_categoria: List[IndicadoresCategoria]
    promedio_general: List[OpcionPorcentaje]

class ProgresoData(BaseModel):
    completados: int
    pendientes: int

class InformePendienteInfo(BaseModel):
    asignatura: str
    docente_responsable: str

class DashboardDocenteResponse(BaseModel):
    total_encuestas_completadas: int
    estadisticas_general: List[OpcionPorcentaje] 
    estadisticas_basico: Optional[EstadisticasDocenteResponse] = None
    estadisticas_superior: Optional[EstadisticasDocenteResponse] = None
    materias_del_ciclo: List[AsignaturaInfo]
    progreso: ProgresoData
    pendientes: List[InformePendienteInfo] 

class AsignaturaDocenteInfo(BaseModel):
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

class AsignarAsignaturaRequest(BaseModel):
    duracion: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "duracion": "anual"
            }
        }
    )
class DocenteListResponse(BaseModel):
    """Response para lista de docentes"""
    docentes: List[DocenteResponse]
    total: int
    
    model_config = ConfigDict(from_attributes=True)
