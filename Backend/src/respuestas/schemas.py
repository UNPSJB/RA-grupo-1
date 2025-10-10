from pydantic import BaseModel, Field
from typing import Optional

class RespuestaBase(BaseModel):
    """Schema base para respuestas, contiene campos comunes"""
    alumno_id: int = Field(..., description="ID del alumno que responde")
    pregunta_id: int = Field(..., description="ID de la pregunta respondida")
    respuesta_texto: Optional[str] = Field(None, description="Respuesta de texto abierto")
    opcion_id: Optional[int] = Field(None, description="ID de la opción seleccionada")
    progreso: int = Field(default=0, ge=0, le=100, description="Progreso del 0 al 100")

class RespuestaCreate(RespuestaBase):
    """Schema para crear una nueva respuesta"""
    # encuesta_id: Optional[int] = Field(None, description="ID de la encuesta")
    pass

class RespuestaUpdate(BaseModel):
    """Schema para actualizar una respuesta existente"""
    respuesta_texto: Optional[str] = None
    opcion_id: Optional[int] = None
    progreso: Optional[int] = Field(None, ge=0, le=100)

class RespuestaOut(RespuestaBase):
    """Schema para leer/retornar una respuesta"""
    id: int
    
    class Config:
        from_attributes = True

# Schemas especializados para diferentes casos de uso
class RespuestaCreateLote(BaseModel):
    """Schema para crear múltiples respuestas en lote"""
    respuestas: list[RespuestaCreate] = Field(..., min_items=1)

class RespuestaDetallada(RespuestaOut):
    """Schema extendido que incluye relaciones"""
    alumno_nombre: Optional[str] = None
    pregunta_texto: Optional[str] = None
    opcion_texto: Optional[str] = None

class RespuestaFiltros(BaseModel):
    """Schema para filtrar respuestas en consultas"""
    alumno_id: Optional[int] = None
    pregunta_id: Optional[int] = None
    progreso_min: Optional[int] = None
    progreso_max: Optional[int] = None