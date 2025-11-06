from pydantic import BaseModel
from datetime import date
from typing import List
from src.resultado_informe.schemas import RespuestaInformeSintetico, RespuestaInformeBase
from src.vinculaciones.models import Duracion
from src.asignaturas.schemas import Asignatura

class InformeSinteticoFinalizadoBase(BaseModel):
    titulo: str
    contenido: str
    anio: int
    duracion: Duracion
    informe_base_id: int 

class InformeSinteticoFinalizadoCreate(InformeSinteticoFinalizadoBase):
    respuestas: List[RespuestaInformeBase]  

class InformeSinteticoFinalizado(InformeSinteticoFinalizadoBase):
    id: int
    respuestas: List[RespuestaInformeSintetico]  

    class Config:
        from_attributes = True

class TablaPregunta2BItem(BaseModel):
    asignatura: Asignatura
    encuesta_B: str
    encuesta_C: str
    encuesta_D: str
    encuesta_ET: str
    encuesta_EP: str
    juicio_valor: str