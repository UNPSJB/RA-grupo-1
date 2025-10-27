from sqlalchemy import Integer, String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING
from src.models import ModeloBase  # 👈 coherente con el resto de los modelos

if TYPE_CHECKING:
    from src.preguntas.models import Pregunta
    from src.alumnos.models import Alumno
    from src.opciones.models import Opcion

class Respuesta(ModeloBase):
    __tablename__ = "respuestas_estudiantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas.id"), nullable=False)

    # Campos para diferentes tipos de respuesta
    respuesta_texto: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    opcion_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    progreso: Mapped[int] = mapped_column(Integer, default=0)

    # Relaciones
    alumno: Mapped[Optional["Alumno"]] = relationship("Alumno", back_populates="respuestas", lazy="joined")
    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")
    opcion: Mapped[Optional["Opcion"]] = relationship("Opcion")
