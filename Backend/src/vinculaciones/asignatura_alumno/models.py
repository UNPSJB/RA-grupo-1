from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.alumnos.models import Alumno
    from src.asignaturas.models import Asignatura

class AlumnoAsignatura(ModeloBase):
    __tablename__ = "asignatura_alumno"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(ForeignKey("alumnos.id"))
    asignatura_id: Mapped[int] = mapped_column(ForeignKey("asignaturas.id"))
    nota_cursada: Mapped[Optional[int]] = mapped_column(Integer)
    anio: Mapped[int] = mapped_column(Integer)
    duracion: Mapped[str] = mapped_column(String)
    
    alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="asignaturas")
    asignatura: Mapped["Asignatura"] = relationship("Asignatura", back_populates="alumnos")