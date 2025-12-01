from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime
from src.encuestas.models import EstadoEncuesta
from src.vinculaciones.models import Duracion
from src.categorias import schemas as categoria_schemas

class PreguntaAbiertaEstudiante(BaseModel):
    """Preguntas abiertas predefinidas"""
    id: str
    texto: str
    tipo: str = "abierta"
    seccion: str
    
    model_config = ConfigDict(from_attributes=True)

class OpcionParaEstudiante(BaseModel):
    """Opciones de respuesta para el estudiante"""
    id: int
    texto: str
    valor: str
    
    model_config = ConfigDict(from_attributes=True)


class PreguntaParaEstudiante(BaseModel):
    """Pregunta formateada para el estudiante"""
    id: int
    texto: str
    tipo: str
    opciones: List[OpcionParaEstudiante] = []  
    
    model_config = ConfigDict(from_attributes=True)

class CategoriaConPreguntas(BaseModel):
    """Categoría con sus preguntas para el estudiante"""
    id: int
    texto: str
    codigo: str
    preguntas: List[PreguntaParaEstudiante]  
    
    model_config = ConfigDict(from_attributes=True)


class EncuestaBase(BaseModel):
    año: int = Field(ge=2000, le=2100, description="Año académico")
    cursado: Duracion
    fecha_inicio: datetime
    fecha_fin: datetime | None = Field(default=None, description="Fecha de finalización de la encuesta")
    carrera: str = Field(min_length=1, max_length=100)
    sede: str = Field(min_length=1, max_length=50)
    titulo: str = Field(min_length=1, max_length=255, description="Título de la encuesta")
    asignatura_id: int = Field(gt=0, description="ID de la asignatura relacionada")

    model_config = ConfigDict(from_attributes=True)
    
class EncuestaCreate(EncuestaBase):
    estado: EstadoEncuesta = EstadoEncuesta.abierta
    activa: bool = True  

    model_config = ConfigDict(from_attributes=True)

class EncuestaUpdate(BaseModel):
    año: Optional[int] = Field(None, ge=2000, le=2100)
    cursado: Optional[Duracion] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    carrera: Optional[str] = Field(None, min_length=1, max_length=100)
    sede: Optional[str] = Field(None, min_length=1, max_length=50)
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    estado: Optional[EstadoEncuesta] = None
    activa: Optional[bool] = None
    asignatura_id: Optional[int] = Field(None, gt=0)
    
    model_config = ConfigDict(from_attributes=True)

class Encuesta(EncuestaBase):
    id: int
    estado: EstadoEncuesta
    activa: bool
    created_at: datetime

class RespuestaBase(BaseModel):
    id: int
    alumno_id: int
    respuesta_texto: Optional[str] = None
    opcion_multiple: Optional[str] = None
    progreso: int

    model_config = ConfigDict(from_attributes=True)

class PreguntaConRespuestas(BaseModel):
    pregunta_id: int
    pregunta_texto: str
    respuestas: List[RespuestaBase] = []

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "pregunta_id": 1,
                "pregunta_texto": "¿Cómo calificarías el curso?",
                "respuestas": [
                    {
                        "id": 1,
                        "alumno_id": 123,
                        "respuesta_texto": "Excelente",
                        "progreso": 100
                    }
                ]
            }
        }
    )

class EncuestaDisponible(BaseModel):
    id: int
    titulo: str
    carrera: str
    sede: str
    cursado: Duracion
    fecha_fin: datetime
    asignatura_nombre: str
    
    model_config = ConfigDict(from_attributes=True)

class EncuestaResumen(BaseModel):
    id: int
    titulo: str
    carrera: str
    cursado: Duracion
    estado: EstadoEncuesta
    fecha_inicio: datetime
    fecha_fin: datetime
    activa: bool
    
    model_config = ConfigDict(from_attributes=True)

class EncuestaAlumnoInfo(BaseModel):
    id: int
    nombre: str
    asignatura: str
    docente: str
    ciclo_lectivo: str
    anio: int | None = None
    fecha_inicio: Optional[str] = None
    fecha_fin: Optional[str] = None
    estado: Optional[str] = None

    model_config = {"from_attributes": True}

class EncuestaParaCompletar(BaseModel):
    id: int
    titulo: str
    asignatura: str
    docente: str
    anio: int
    duracion: str
    ciclo_lectivo: str
    codigo_asignatura: Optional[str] = None  
    carrera: Optional[str] = None  
    categorias: List[categoria_schemas.CategoriaConPreguntas] 
    preguntas_abiertas: List[PreguntaAbiertaEstudiante] = []

    
    model_config = ConfigDict(from_attributes=True)

class RespuestaIndividual(BaseModel):
    """Schema para una respuesta individual de encuesta"""
    pregunta_id: int
    opcion_id: Optional[int] = None
    texto: Optional[str] = None
    valor: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class RespuestaEncuesta(BaseModel):
    """Schema para enviar respuestas de encuesta"""
    encuesta_id: int
    alumno_id: int
    respuestas: List[RespuestaIndividual]  
    
    model_config = ConfigDict(from_attributes=True)

class RespuestaCreate(BaseModel):
    pregunta_id: int
    opcion_seleccionada: Optional[str] = None
    texto_respuesta: Optional[str] = None
    subrespuestas: Optional[Dict[str, str]] = None

class RespuestasAlumnoCreate(BaseModel):
    alumno_id: int
    asignatura_id: int
    respuestas: List[RespuestaCreate]