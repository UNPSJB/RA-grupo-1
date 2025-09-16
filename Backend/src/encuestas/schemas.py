from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum

class EstadoEncuestaEnum(str, Enum):
    PENDIENTE = "pendiente"
    EN_PROGRESO = "en_progreso"
    COMPLETADA = "completada"

# Esquemas de Alumno (para evitar importaciones circulares)
class AlumnoBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    legajo: str

class AlumnoResponse(AlumnoBase):
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

# Esquemas de Materia
class MateriaBase(BaseModel):
    nombre: str
    codigo: str
    departamento: str

class MateriaResponse(MateriaBase):
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

# Esquemas de Encuesta
class EncuestaBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha_inicio: datetime
    fecha_fin: datetime
    activa: bool = True

class EncuestaResponse(EncuestaBase):
    id: int
    materia_id: int
    created_at: datetime
    materia: MateriaResponse
    
    model_config = {"from_attributes": True}

# Esquemas de EncuestaAlumno
class EncuestaAlumnoBase(BaseModel):
    estado: EstadoEncuestaEnum
    progreso: int = 0
    fecha_completado: Optional[datetime] = None

class EncuestaAlumnoResponse(EncuestaAlumnoBase):
    id: int
    alumno_id: int
    encuesta_id: int
    created_at: datetime
    updated_at: datetime
    encuesta: EncuestaResponse
    
    model_config = {"from_attributes": True}

# Esquemas de Pregunta
class PreguntaResponse(BaseModel):
    id: int
    texto: str
    tipo: str
    obligatoria: bool
    orden: int
    
    model_config = {"from_attributes": True}

# Esquemas de Opción
class OpcionResponse(BaseModel):
    id: int
    texto: str
    valor: Optional[str] = None
    orden: int
    
    model_config = {"from_attributes": True}

# Esquemas de Respuesta
class RespuestaAlumnoResponse(BaseModel):
    id: int
    pregunta_id: int
    respuesta_texto: Optional[str] = None
    opcion_id: Optional[int] = None
    valor_numerico: Optional[float] = None
    respondido_at: datetime
    pregunta: PreguntaResponse
    
    model_config = {"from_attributes": True}

# Esquemas compuestos para la funcionalidad principal
class EncuestaCompletadaDetalle(BaseModel):
    encuesta_alumno: EncuestaAlumnoResponse
    total_preguntas: int
    respuestas: List[RespuestaAlumnoResponse]

class AlumnoEncuestasCompletadas(BaseModel):
    alumno: AlumnoResponse
    encuestas_completadas: List[EncuestaCompletadaDetalle]
    total_completadas: int

class ResumenMateriaEncuestas(BaseModel):
    materia_id: int
    materia_nombre: str
    materia_codigo: str
    departamento: str
    encuestas_completadas: int
    progreso_promedio: float

class ResumenAlumnoEncuestas(BaseModel):
    alumno: AlumnoResponse
    resumen_por_materia: List[ResumenMateriaEncuestas]
    total_completadas: int
    porcentaje_completadas: float