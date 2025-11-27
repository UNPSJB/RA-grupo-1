from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Integer, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import ModeloBase
from src.vinculaciones.models import Duracion

if TYPE_CHECKING:
    from src.alumnos.models import Alumno
    from src.encuestas.models import Encuesta
    from src.asignaturas.models import Asignatura
    from src.respuestas.models import Respuesta


class EncuestaFinalizada(ModeloBase):
    __tablename__ = "encuestas_finalizadas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    alumno_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("alumnos.id"),
        nullable=False,
    )

    encuesta_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("encuestas.id"),
        nullable=False,
    )

    asignatura_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("asignaturas.id"),
        nullable=False,
    )

    fecha_finalizada: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now,
        nullable=False,
    )

    anio: Mapped[int] = mapped_column(Integer, nullable=False)

    duracion: Mapped[Duracion] = mapped_column(
    SQLEnum(Duracion, values_callable=lambda x: [e.value for e in x]),
    nullable=False,
    )

    # Relaciones
    alumno: Mapped["Alumno"] = relationship(
        "Alumno",
        back_populates="encuestas_finalizadas",
    )

    encuesta: Mapped["Encuesta"] = relationship(
        "Encuesta",
        back_populates="encuestas_finalizadas",
    )

    asignatura: Mapped["Asignatura"] = relationship(
        "Asignatura",
        back_populates="encuestas_finalizadas",
    )

    respuestas: Mapped[list["Respuesta"]] = relationship(
        "Respuesta",
        back_populates="encuesta_finalizada",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
