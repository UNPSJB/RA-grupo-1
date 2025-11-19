from __future__ import annotations
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List, TYPE_CHECKING
from src.models import ModeloBase
from src.vinculaciones.models import asignatura_alumno, informe_catedra_asignatura

if TYPE_CHECKING:
    from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
    from src.alumnos.models import Alumno
    from src.encuestas.models import Encuesta
    from src.departamentos.models import Departamento
    from src.encuesta_finalizada.models import EncuestaFinalizada
    from src.informe_catedra.models import InformeCatedra

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
        secondary=asignatura_alumno,
        back_populates="asignaturas"
    )

    encuestas: Mapped[List["Encuesta"]] = relationship(
        "Encuesta", 
        back_populates="asignatura"
    )

    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"), nullable=False)

    departamento: Mapped["Departamento"] = relationship("Departamento", back_populates="asignaturas")

    encuestas_finalizadas: Mapped[List["EncuestaFinalizada"]] = relationship(
        "EncuestaFinalizada", 
        back_populates="asignatura"
    )

    informes_catedra: Mapped[List["InformeCatedra"]] = relationship(
        "InformeCatedra",
        back_populates="asignatura"  
    )