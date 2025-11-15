from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from src.resultado_informe.schemas import RespuestaInformeSintetico
from src.resultado_informe import schemas as respuestas_schemas
from src.vinculaciones.models import Duracion
from src.asignaturas import schemas as asignatura_schemas

class InformeSinteticoFinalizadoBase(BaseModel):
    titulo: str
    contenido: str
    anio: int
    duracion: Duracion
    informe_base_id: int 
    carrera_id: int

class InformeSinteticoFinalizadoCreate(InformeSinteticoFinalizadoBase):
    respuestas: List[respuestas_schemas.RespuestaInformeSintetico]  

class InformeSinteticoFinalizado(InformeSinteticoFinalizadoBase):
    id: int
    respuestas: List[RespuestaInformeSintetico]  

    class Config:
        from_attributes = True

class TablaPregunta2Item(BaseModel):
    Asignatura: asignatura_schemas.Asignatura
    porcentaje_teoricas: str
    porcentaje_practicas: str
    justificacion: Optional[str] = None

    model_config = {"from_attributes": True}

class TablaPregunta2BItem(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    porcentaje_teoricas: str
    porcentaje_practicas: str
    justificacion: Optional[str] = None

    model_config = {"from_attributes": True}

class RespuestasSeccion2C(BaseModel):
    aspectos_positivos_ensenanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_ensenanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias: Optional[str] = None    

class TablaPregunta2CItem(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    respuestas: RespuestasSeccion2C

    model_config = {"from_attributes": True}

class InformacionGeneral(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    codigo: int
    nombre: str
    cantidad_alumnos: int
    cantidad_comisiones_teoriacas: int
    cantidad_comisiones_practicas: int

    model_config = {"from_attributes": True}


class TemasDesarrolladosItem(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    porcentaje_texto: Optional[str] = None
    estrategia_texto: Optional[str] = None

    model_config = {"from_attributes": True}

class ActividadesDocente(BaseModel):
    capacitacion: Optional[str] = None
    investigacion: Optional[str] = None
    extension: Optional[str] = None
    gestion: Optional[str] = None
    observaciones: Optional[str] = None

class DocenteConActividades(BaseModel):
    nombre_docente: str
    rol_docente: str
    actividades: ActividadesDocente

class ActividadesPorAsignaturaItem(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    docentes: List[DocenteConActividades]

    model_config = {"from_attributes": True}


class EquipamientoBibliografia(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    bibliografia: str
    equipamiento: str

class DesempenoAuxiliarDetalle(BaseModel):
    espacio_curricular: str
    nombre_apellido: str
    calificacion_E: bool = False  
    calificacion_MB: bool = False 
    calificacion_B: bool = False  
    calificacion_R: bool = False  
    calificacion_I: bool = False  
    justificacion: str


class TablaDesempenoAuxiliar(BaseModel):
    asignatura: asignatura_schemas.Asignatura
    auxiliares: List[DesempenoAuxiliarDetalle]
    
    model_config = {"from_attributes": True}
