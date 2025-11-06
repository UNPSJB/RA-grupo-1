from pydantic import BaseModel
from typing import Optional

class RespuestaInformeBase(BaseModel):
    pregunta_id: int
    texto_respuesta: Optional[str] = None
    asignatura_id: int

class RespuestaInformeCreate(RespuestaInformeBase):
    informe_catedra_finalizado_id: int
    
class RespuestaInforme(RespuestaInformeBase):
    id: int
    informe_catedra_finalizado_id: int 

    class Config:
        from_attributes = True

class RespuestaConPregunta(RespuestaInformeBase):
    id: int
    informe_catedra_finalizado_id: int
    pregunta_texto: Optional[str] = None
    pregunta_tipo: Optional[str] = None
    pregunta_orden: Optional[int] = None
    categoria_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class RespuestaInformeSintetico(RespuestaInformeBase):
    id: int
    informe_sintetico_finalizado_id: int  
    pregunta_texto: Optional[str] = None
    pregunta_tipo: Optional[str] = None
    pregunta_orden: Optional[int] = None
    categoria_id: Optional[int] = None
    
    class Config:
        from_attributes = True