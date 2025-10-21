from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List
from src.vinculaciones.models import alumno_asignatura, alumno_encuesta

class Alumno(ModeloBase):
    __tablename__ = "alumnos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    persona_id: Mapped[int] = mapped_column(ForeignKey("personas.id"), unique=True)
    CUIL: Mapped[str] = mapped_column(String, index=True)
    usuario: Mapped[str] = mapped_column(String, index=True)
    clave: Mapped[str] = mapped_column(String, index=True)

    # RELACIONES 
    encuestas_completadas: Mapped[List["EncuestaCompletada"]] = relationship(
        "EncuestaCompletada", 
        back_populates="alumno"
    )
    
    asignaturas: Mapped[List["Asignatura"]] = relationship(
        "Asignatura",
        secondary=alumno_asignatura,
        back_populates="alumnos"
    )

    encuestas: Mapped[List["Encuesta"]] = relationship(
        "Encuesta",
        secondary=alumno_encuesta,
        back_populates="alumnos"
    )

    #respuestas = relationship("Respuesta", back_populates="alumno", lazy="select")