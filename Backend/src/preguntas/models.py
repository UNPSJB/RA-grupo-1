from __future__ import annotations 
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.opciones.models import Opcion
from src.vinculaciones.models import pregunta_opcion
from src.database import Base
import enum
from typing import List, TYPE_CHECKING   


if TYPE_CHECKING:
    from src.respuestas.models import Respuesta

class TipoPreguntaEnum(str, enum.Enum):
    ABIERTA = "abierta"
    OPCION_MULTIPLE = "opcion_multiple"
    UNICA_OPCION = "unica_opcion"
    BOOLEANA = "booleana"

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    encuesta_id: Mapped[int] = mapped_column(Integer, ForeignKey("encuestas.id"))

    respuestas: Mapped[List["Respuesta"]] = relationship("Respuesta", back_populates="pregunta")

    tipo: Mapped[TipoPreguntaEnum] = mapped_column(
        String(50), 
        nullable=False, 
        default=TipoPreguntaEnum.ABIERTA
    )

     # Relación para preguntas de opción múltiple
    opciones: Mapped[List["Opcion"]] = relationship(
        "Opcion",
        secondary=pregunta_opcion,
        back_populates="preguntas"
    )

