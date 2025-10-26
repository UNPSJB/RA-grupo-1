from __future__ import annotations
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List, TYPE_CHECKING
from src.models import ModeloBase
from src.vinculaciones.models import alumno_asignatura

if TYPE_CHECKING:
    from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
    from src.alumnos.models import Alumno
    from src.encuestas.models import Encuesta
    from src.departamentos.models import Departamento
    from src.encuestas_completadas.models import EncuestaCompletada

class Asignatura(ModeloBase):
    __tablename__ = "asignaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False, index=True)
    matricula: Mapped[str] = mapped_column(String, nullable=False, index=True, unique=True)
    
    docentes_asociados: Mapped[List["AsignaturaDocente"]] = relationship(
        "AsignaturaDocente", 
        back_populates="asignatura"
    )
    
    alumnos: Mapped[Optional[List["Alumno"]]] = relationship(
        "Alumno",
        secondary=alumno_asignatura,
        back_populates="asignaturas"
    )

    encuestas: Mapped[List["Encuesta"]] = relationship(
        "Encuesta", 
        back_populates="asignatura"
    )

    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"), nullable=False)
    departamento: Mapped["Departamento"] = relationship("Departamento", back_populates="asignaturas")

    encuestas_completadas: Mapped[List["EncuestaCompletada"]] = relationship(
        "EncuestaCompletada", 
        back_populates="asignatura"
    )