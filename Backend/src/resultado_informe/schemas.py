from pydantic import BaseModel
from typing import Optional

class RespuestaInformeBase(BaseModel):
    pregunta_id: int
    opcion_id: Optional[int] = None
    texto_respuesta: Optional[str] = None

class RespuestaInformeCreate(RespuestaInformeBase):
    informe_catedra_finalizado_id: int
    
class RespuestaInforme(RespuestaInformeBase):
    id: int
    informe_catedra_finalizado_id: int 

    class Config:
        from_attributes = True