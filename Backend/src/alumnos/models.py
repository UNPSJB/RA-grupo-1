from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List, TYPE_CHECKING
from src.vinculaciones.models import alumno_asignatura, alumno_encuesta

if TYPE_CHECKING:
    from src.respuestas.models import Respuesta

class Alumno(ModeloBase):
    __tablename__ = "alumnos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    persona_id: Mapped[int] = mapped_column(ForeignKey("personas.id"), unique=True)
    CUIL: Mapped[str] = mapped_column(String, index=True)
    usuario: Mapped[str] = mapped_column(String, index=True)
    clave: Mapped[str] = mapped_column(String, index=True)
    persona: Mapped["src.personas.models.Persona"] = relationship("src.personas.models.Persona", back_populates="alumno")

    #respuestas: Mapped[List["src.respuestas.models.Respuesta"]] = relationship(
    #    "src.respuestas.models.Respuesta",
    #back_populates="alumno"
    #)
    
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

    # respuestas: Mapped[List["Respuesta"]] = relationship(
    #     "Respuesta", 
    #     back_populates="alumno",
    #     cascade="all, delete-orphan"
    # )