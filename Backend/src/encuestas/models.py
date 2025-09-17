from typing import Optional, List
from sqlalchemy import Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase
from enum import Enum

class Cursado(str, Enum):
    cuatrimestre1 = "cuatrimestre 1"
    cuatrimestre2 = "cuatrimestre 2"
    anual= "anual"


class EstadoEncuesta(str, Enum):
    abierta = "abierta"
    cerrada = "cerrada"

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    carrera: Mapped[str] = mapped_column(String, index=True)
    asignatura: Mapped[str] = mapped_column(String, index=True)
    cursado: Mapped[Cursado] = mapped_column(SQLEnum(Cursado), nullable=False)
    año: Mapped[int] = mapped_column(Integer, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)    
    fecha_inicio: Mapped[str] = mapped_column(String, index=True)
    fecha_fin: Mapped[str] = mapped_column(String, index=True) 
    estado: Mapped[EstadoEncuesta] = mapped_column(SQLEnum(EstadoEncuesta), nullable=False, default=EstadoEncuesta.abierta)