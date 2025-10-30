from sqlalchemy import Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from datetime import datetime
from src.vinculaciones.models import Duracion
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.alumnos.models import Alumno
    from src.encuestas.models import Encuesta
    from src.asignaturas.models import Asignatura  
    from src.respuestas.models import Respuesta

class EncuestaFinalizada(ModeloBase):
    __tablename__ = "encuestas_finalizadas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(ForeignKey("alumnos.id"))
    encuesta_id: Mapped[int] = mapped_column(ForeignKey("encuestas.id"))
    asignatura_id: Mapped[int] = mapped_column(ForeignKey("asignaturas.id"))
    fecha_finalizada: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    anio: Mapped[int] = mapped_column(Integer)
    duracion: Mapped[Duracion] = mapped_column(Enum(Duracion))

    alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="encuestas_finalizadas")
    encuesta: Mapped["Encuesta"] = relationship("Encuesta", back_populates="encuestas_finalizadas")
    asignatura: Mapped["Asignatura"] = relationship("Asignatura", back_populates="encuestas_finalizadas")
    respuestas: Mapped[list["Respuesta"]] = relationship("Respuesta", back_populates="encuesta_finalizada")