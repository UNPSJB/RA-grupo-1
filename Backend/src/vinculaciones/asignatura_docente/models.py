from sqlalchemy import ForeignKey, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.vinculaciones.models import Duracion
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.docentes.models import Docente
    from src.asignaturas.models import Asignatura
class AsignaturaDocente(ModeloBase):
    __tablename__ = "asignatura_docente"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index = True)
    docente_id: Mapped[int] = mapped_column(ForeignKey("docentes.id"))
    asignatura_id: Mapped[int] = mapped_column(ForeignKey("asignaturas.id"))
    anio: Mapped[int] = mapped_column(Integer, nullable=False)
    duracion: Mapped[Duracion] = mapped_column(Enum(Duracion), nullable=False)
    
    
    docente: Mapped["Docente"] = relationship("Docente", back_populates="asignaturas_asociadas")
    asignatura: Mapped["Asignatura"] = relationship("Asignatura", back_populates="docentes_asociados")