from sqlalchemy import Integer, String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.preguntas.models import Pregunta

class Respuesta(Base):
    __tablename__ = "respuestas_estudiantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas.id"), nullable=False)
  
    # Campos para diferentes tipos de respuesta
    respuesta_texto: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    opcion_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    progreso: Mapped[int] = mapped_column(Integer, default=0)

    #Relaciones 
    #alumno: Mapped["src.alumnos.models.Alumno"] = relationship(
    #"src.alumnos.models.Alumno",
    #back_populates="respuestas"
    #)
    #alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="respuestas")
    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")
    opcion: Mapped["Opcion"] = relationship("Opcion")