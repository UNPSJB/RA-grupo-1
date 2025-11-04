from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from src.models import ModeloBase
from src.vinculaciones.models import alumno_encuesta, Duracion
from enum import StrEnum
from typing import Optional, List

class EstadoEncuesta(StrEnum):
    abierta = "abierta"
    cerrada = "cerrada"
    programada = "programada"

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    carrera: Mapped[str] = mapped_column(String, index=True)
    cursado: Mapped[Duracion] = mapped_column(Enum(Duracion), nullable=False)
    año: Mapped[int] = mapped_column(Integer, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)    
    estado: Mapped[EstadoEncuesta] = mapped_column(Enum(EstadoEncuesta), nullable=False, default=EstadoEncuesta.abierta)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    fecha_inicio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    fecha_fin: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    asignatura_id: Mapped[int] = mapped_column(Integer, ForeignKey("asignaturas.id"))
    
    # Relaciones
    asignatura: Mapped["Asignatura"] = relationship(
        "Asignatura", back_populates="encuestas"
    )

    alumnos: Mapped[list["Alumno"]] = relationship(
        "Alumno", secondary=alumno_encuesta, back_populates="encuestas"
    )

    encuestas_finalizadas: Mapped[List["EncuestaFinalizada"]] = relationship(
        "EncuestaFinalizada", 
        back_populates="encuesta"
    )

    categorias: Mapped[List["Categoria"]] = relationship(
        "Categoria",
        back_populates="encuesta"
    )

    # Verifica si la encuesta esta activa
    @property
    def esta_activa(self) -> bool:
        ahora = datetime.now()
        return (self.activa and 
                self.estado == EstadoEncuesta.abierta and
                self.fecha_inicio <= ahora <= self.fecha_fin)