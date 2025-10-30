from pydantic import BaseModel, Field
from typing import Optional

class RespuestaBase(BaseModel):
    """Schema base para respuestas, contiene campos comunes"""
    encuesta_finalizada_id: int = Field(..., description="ID de la encuesta finalizada")
    pregunta_id: int = Field(..., description="ID de la pregunta respondida")
    respuesta_texto: Optional[str] = Field(None, description="Respuesta de texto abierto")
    opcion_id: Optional[int] = Field(None, description="ID de la opción seleccionada")

class RespuestaCreate(RespuestaBase):
    """Schema para crear una nueva respuesta"""
    pass

class RespuestaUpdate(BaseModel):
    """Schema para actualizar una respuesta existente"""
    respuesta_texto: Optional[str] = None
    opcion_id: Optional[int] = None

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
    encuesta_finalizada_id: Optional[int] = None
    pregunta_id: Optional[int] = None