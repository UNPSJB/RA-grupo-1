from pydantic import BaseModel
from src.informes.models import EstadoInforme

class InformeBase(BaseModel):
    sede: str
    ciclo_lectivo: str
    codigo_actividad_curricular: str
    docente_responsable: str
    cantidad_alumnos_inscriptos: int
    cantidad_com_teoricas: int
    cantidad_com_practicas: int
    estado: EstadoInforme

class InformeCreate(InformeBase):
    pass

class InformeUpdate(InformeBase):
    pass

class Informe(InformeBase):
    id: int
    model_config = {"from_attributes": True}