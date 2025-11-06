from pydantic import BaseModel
from src.vinculaciones.models import Duracion
from src.resultado_informe import schemas as respuestas_schemas
from typing import List, Optional
from src.resultado_informe.schemas import RespuestaConPregunta

class InformeCatedraFinalizadoBase(BaseModel):
    docente_asignatura_id: int
    informe_catedra_base_id: int
    titulo: Optional[str] = None
    contenido: Optional[str] = None
    cantidadAlumnos: Optional[int] = None
    anio: Optional[int] = None
    duracio: Optional[Duracion] = None
    cantidadComisionesTeoricas: Optional[int] = None
    cantidadComisionesPracticas: Optional[int] = None

class InformeCatedraFinalizadoCreate(InformeCatedraFinalizadoBase):
    pass

class InformeCatedraFinalizadoConRespuestasCreate(InformeCatedraFinalizadoBase):
    respuestas: List[respuestas_schemas.RespuestaInformeBase]
    

class InformeCatedraFinalizado(InformeCatedraFinalizadoBase):
    id: int
    model_config = {"from_attributes": True}

class InformePendiente(BaseModel):
    asignatura_id: int
    asignatura_nombre: str
    docente_asignatura_id: int
    model_config = {"from_attributes": True}

class InformeCatedraFinalizadoDetalle(InformeCatedraFinalizadoDetalle):
    id: int
    resultado_informe: List[RespuestaConPregunta] = []

    model_config = {"from_attributes": True}