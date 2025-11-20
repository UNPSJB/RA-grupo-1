from __future__ import annotations
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.asignaturas.models import Asignatura
    from src.departamentos.models import Departamento

class AsignaturaDepartamentoSede(ModeloBase):
    __tablename__ = "asignatura_departamento_sede"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    asignatura_id: Mapped[int] = mapped_column(Integer, ForeignKey("asignaturas.id"), nullable=False)
    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"), nullable=False)
    sede: Mapped[str] = mapped_column(String, nullable=False)

    # Relaciones
    asignatura: Mapped["Asignatura"] = relationship(
        "Asignatura", 
        back_populates="departamentos_sedes"
    )
    
    departamento: Mapped["Departamento"] = relationship(
        "Departamento", 
        back_populates="asignaturas_sedes"
    )