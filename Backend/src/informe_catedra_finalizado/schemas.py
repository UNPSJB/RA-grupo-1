from pydantic import BaseModel
from src.vinculaciones.models import Duracion
from src.resultado_informe import schemas as respuestas_schemas
from typing import List, Optional
from src.resultado_informe.schemas import RespuestaConPregunta

class InformeCatedraFinalizadoBase(BaseModel):
    asignatura_docente_id: int
    informe_catedra_id: int
    titulo: Optional[str] = None
    contenido: Optional[str] = None
    cantidadAlumnos: Optional[int] = None
    anio: Optional[int] = None
    duracion: Optional[Duracion] = None  
    cantidadComisionesTeoricas: Optional[int] = None
    cantidadComisionesPracticas: Optional[int] = None
    JTP: Optional[str] = None
    aux_primera: Optional[str] = None
    aux_segunda: Optional[str] = None

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

class InformeCatedraFinalizadoDetalle(InformeCatedraFinalizadoBase): 
    id: int
    resultado_informe: List[RespuestaConPregunta] = []
    asignaturaId: int
    asignaturaNombre: Optional[str] = None
    asignaturaCodigo: Optional[str] = None
    sede: Optional[str] = None
    docenteResponsable: Optional[str] = None
    docente_asignatura_id: int
    informe_catedra_base_id: int

    model_config = {"from_attributes": True}