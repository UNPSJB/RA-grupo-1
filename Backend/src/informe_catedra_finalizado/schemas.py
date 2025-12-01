from pydantic import BaseModel
from src.vinculaciones.models import Duracion, Estado
from typing import List, Optional
from src.resultado_informe import schemas as respuestas_schemas
from src.respuestas_informe.schemas import RespuestaInformeBase

class InformeCatedraCabecera(BaseModel):
    id: int
    asignatura_docente_id: int
    informe_catedra_id: int
    titulo: Optional[str] = None
    anio: Optional[int] = None
    duracion: Optional[Duracion] = None
    estado: Estado
    asignaturaNombre: str
    asignaturaCodigo: str

    model_config = {"from_attributes": True}


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
    estado: Estado
    model_config = {"from_attributes": True}

class InformeCatedraFinalizadoDetalle(InformeCatedraFinalizadoBase): 
    id: int
    estado: Estado
    resultado_informe: List[respuestas_schemas.RespuestaConPregunta] = []
    respuestas_informe: List[respuestas_schemas.RespuestaInforme] = []
    asignaturaId: int
    asignaturaNombre: Optional[str] = None
    asignaturaCodigo: Optional[str] = None
    docenteResponsable: Optional[str] = None

    model_config = {"from_attributes": True}

class RespuestaInformeUpdate(RespuestaInformeBase):
    pass

class InformeCatedraFinalizadoUpdate(BaseModel):
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
    estado: Optional[Estado] = None
    respuestas: List[RespuestaInformeUpdate] = []
    model_config = {"from_attributes": True}

class InformeCatedraCabecera(BaseModel):
    id: int
    asignatura_docente_id: int
    informe_catedra_id: int
    titulo: Optional[str] = None
    anio: Optional[int] = None
    duracion: Optional[Duracion] = None
    estado: Estado
    asignaturaNombre: str
    asignaturaCodigo: str

    model_config = {"from_attributes": True}

class RespuestaBorrador(BaseModel):
    pregunta_id: int
    opcion_id: Optional[int] = None
    texto_respuesta: Optional[str] = None

class BorradorUpdate(BaseModel):
    respuestas: List[RespuestaBorrador]