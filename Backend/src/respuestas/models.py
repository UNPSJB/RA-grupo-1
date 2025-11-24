from typing import Optional, TYPE_CHECKING

from sqlalchemy import Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import ModeloBase

if TYPE_CHECKING:
    from src.encuesta_finalizada.models import EncuestaFinalizada
    from src.preguntas.models import Pregunta
    from src.alumnos.models import Alumno
    from src.opciones.models import Opcion


class Respuesta(ModeloBase):
    __tablename__ = "respuestas_estudiantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    alumno_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("alumnos.id"),
        nullable=False,
    )

    pregunta_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("preguntas.id"),
        nullable=False,
    )

    respuesta_texto: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    opcion_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("opciones.id", ondelete="SET NULL"),
        nullable=True,
    )

    encuesta_finalizada_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("encuestas_finalizadas.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ===================== Relaciones =====================

    alumno: Mapped["Alumno"] = relationship(
        "Alumno",
        back_populates="respuestas",
        lazy="joined",
    )

    pregunta: Mapped["Pregunta"] = relationship(
        "Pregunta",
        back_populates="respuestas",
    )

    opcion: Mapped[Optional["Opcion"]] = relationship(
        "Opcion",
        lazy="joined",
    )

    encuesta_finalizada: Mapped["EncuestaFinalizada"] = relationship(
        "EncuestaFinalizada",
        back_populates="respuestas",
    )
