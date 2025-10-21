from sqlalchemy import Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from datetime import datetime
from typing import List

class EncuestaCompletada(ModeloBase):
    __tablename__ = "encuestas_completadas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(ForeignKey("alumnos.id"))
    encuesta_id: Mapped[int] = mapped_column(ForeignKey("encuestas.id"))
    fecha_completada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="encuestas_completadas")
    encuesta: Mapped["Encuesta"] = relationship("Encuesta", back_populates="encuestas_completadas")
    #respuestas: Mapped[List["Respuesta"]] = relationship("Respuesta", back_populates="encuesta_completada")