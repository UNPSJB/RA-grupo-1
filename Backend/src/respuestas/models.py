from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base
from src.preguntas.models import Pregunta, Opcion

class Respuesta(Base):
    __tablename__ = "respuestas_estudiantes"
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"))
    encuesta_id = Column(Integer, ForeignKey("encuestas.id"))
    respuesta_texto = Column(String, nullable=True)
    opcion_multiple = Column(String, nullable=True)
    progreso = Column(Integer, default=0)
    preguntas: Mapped[list["Pregunta"]] = relationship(
        "Pregunta",
        back_populates="respuestas",
        cascade="all, delete-orphan"
    )