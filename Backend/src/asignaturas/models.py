from __future__ import annotations
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, List, TYPE_CHECKING
from src.models import ModeloBase
from src.vinculaciones.models import asignatura_alumno, asignatura_carrera

if TYPE_CHECKING:
    from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
    from src.alumnos.models import Alumno
    from src.encuestas.models import Encuesta
    from src.departamentos.models import Departamento
    from src.encuesta_finalizada.models import EncuestaFinalizada
    from src.carreras.models import Carrera
    from src.vinculaciones.asignatura_departamento_sede.models import AsignaturaDepartamentoSede


class Asignatura(ModeloBase):
    __tablename__ = "asignaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False, index=True)
    matricula: Mapped[str] = mapped_column(String, nullable=False, index=True, unique=True)

    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"), nullable=False)

    docentes_asociados: Mapped[List["AsignaturaDocente"]] = relationship(
        "AsignaturaDocente",
        back_populates="asignatura",
        cascade="all, delete-orphan"
    )

    alumnos: Mapped[Optional[List["Alumno"]]] = relationship(
        "Alumno",
        secondary=asignatura_alumno,
        back_populates="asignaturas"
    )

    carreras: Mapped[Optional[List["Carrera"]]] = relationship(
        "Carrera",
        secondary=asignatura_carrera,
        back_populates="asignaturas"
    )

    encuestas: Mapped[Optional[List["Encuesta"]]] = relationship(
        "Encuesta",
        back_populates="asignatura",
        cascade="all, delete-orphan"
    )

    encuestas_finalizadas: Mapped[Optional[List["EncuestaFinalizada"]]] = relationship(
        "EncuestaFinalizada",
        back_populates="asignatura"
    )

    departamento: Mapped["Departamento"] = relationship(
        "Departamento",
        back_populates="asignaturas"
    )

    # AsignaturaDepartamentoSede
    departamentos_sedes: Mapped[List["AsignaturaDepartamentoSede"]] = relationship(
        "AsignaturaDepartamentoSede",
        back_populates="asignatura",
        cascade="all, delete-orphan"
    )

    # Propiedad para obtener un docente principal
    @property
    def docente(self):
        if self.docentes_asociados:
            return self.docentes_asociados[0].docente
        return None
