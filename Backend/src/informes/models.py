from enum import Enum
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column#, relationship
from src.models import ModeloBase

class EstadoInforme(str, Enum):
    abierto = "abierto"
    cerrado = "cerrado"

class Informe(ModeloBase):
    __tablename__ = "informes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    ciclo_lectivo: Mapped[str] = mapped_column(String, index=True)
    codigo_actividad_curricular: Mapped[str] = mapped_column(String, index=True)
    docente_responsable: Mapped[str] = mapped_column(String, index=True) 
    cantidad_alumnos_inscriptos: Mapped[int] = mapped_column(Integer)
    cantidad_com_teoricas: Mapped[int] = mapped_column(Integer)
    cantidad_com_practicas: Mapped[int] = mapped_column(Integer)
    estado: Mapped[EstadoInforme] = mapped_column(String, index=True)