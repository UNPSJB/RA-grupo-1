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
    from src.informe_catedra.models import InformeCatedra
    from src.carreras.models import Carrera
    from src.vinculaciones.asignatura_departamento_sede.models import AsignaturaDepartamentoSede


class Asignatura(ModeloBase):
    __tablename__ = "asignaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False, index=True)
    matricula: Mapped[str] = mapped_column(String, nullable=False, index=True, unique=True)
    
    # Foreign Key para departamento
    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"), nullable=False)
    
    # Relación con docentes
    docentes_asociados: Mapped[List["AsignaturaDocente"]] = relationship(
        "AsignaturaDocente", 
        back_populates="asignatura"
    )
    
    # Relación con alumnos
    alumnos: Mapped[Optional[List["Alumno"]]] = relationship(
        "Alumno",
        secondary=asignatura_alumno,
        back_populates="asignaturas"
    )

    # Relación con carreras
    carreras: Mapped[Optional[List["Carrera"]]] = relationship(
        "Carrera",
        secondary=asignatura_carrera,
        back_populates="asignaturas"
    )

    # Relación con encuestas
    encuestas: Mapped[Optional[List["Encuesta"]]] = relationship(
        "Encuesta",
        back_populates="asignatura",
        cascade="all, delete-orphan"
    )

    # Relación con encuestas finalizadas
    encuestas_finalizadas: Mapped[Optional[List["EncuestaFinalizada"]]] = relationship(
        "EncuestaFinalizada", 
        back_populates="asignatura"
    )

    # Relación con departamento
    departamento: Mapped["Departamento"] = relationship(
        "Departamento", 
        back_populates="asignaturas"
    )

    # Relación con informes de cátedra
    informes_catedra: Mapped[Optional[List["InformeCatedra"]]] = relationship(
        "InformeCatedra",
        back_populates="asignatura",
        cascade="all, delete-orphan" 
    )

    # Relación con AsignaturaDepartamentoSede
    departamentos_sedes: Mapped[List["AsignaturaDepartamentoSede"]] = relationship(
        "AsignaturaDepartamentoSede",
        back_populates="asignatura",
        cascade="all, delete-orphan"
    )

    # Propiedad para obtener el primer docente asociado a la asignatura
    @property
    def docente(self):
        """Devuelve el primer docente asociado a la asignatura (si existe)."""
        if self.docentes_asociados and len(self.docentes_asociados) > 0:
            return self.docentes_asociados[0].docente
        return None