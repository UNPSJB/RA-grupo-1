from sqlalchemy import Integer, String, ForeignKey, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.carreras.models import Carrera
    from src.asignaturas.models import Asignatura
    from src.vinculaciones.asignatura_departamento_sede.models import AsignaturaDepartamentoSede


class Departamento(ModeloBase):
    __tablename__ = "departamentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    sede_id = Column(Integer, ForeignKey("sedes.id"))
    profesor_a_cargo: Mapped[str] = mapped_column(String, nullable=True)

    carreras: Mapped[Optional[List["Carrera"]]] = relationship("Carrera",back_populates="departamento")

    asignaturas: Mapped[List["Asignatura"]] = relationship("Asignatura", back_populates="departamento")

    asignaturas_sedes: Mapped[list["AsignaturaDepartamentoSede"]] = relationship(
    "AsignaturaDepartamentoSede",
    back_populates="departamento",
    cascade="all, delete-orphan"
    )

    sede = relationship("Sede", back_populates="departamentos")