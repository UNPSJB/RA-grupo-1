from sqlalchemy import Integer, String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
    from src.personas.models import Persona

class Docente(ModeloBase):
    __tablename__ = "docentes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # Una persona solo puede ser docente una vez
    persona_id: Mapped[int] = mapped_column(ForeignKey("personas.id"), unique=True, nullable=False)
    
    # Relacion con persona
    persona: Mapped["Persona"] = relationship("Persona", back_populates="docente")

    # Relacion con asignaturas
    asignaturas_asociadas: Mapped[List["AsignaturaDocente"]] = relationship(
        "AsignaturaDocente", 
        back_populates="docente",
        cascade="all, delete-orphan"
    )