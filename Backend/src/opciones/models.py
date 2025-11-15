from __future__ import annotations
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.preguntas.models import Pregunta

class Opcion(ModeloBase):
    __tablename__ = "opciones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(100), nullable=False)
    contenido: Mapped[str] = mapped_column(String, nullable=False)

    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas.id", ondelete="CASCADE"), nullable=False)

    pregunta = relationship("Pregunta", back_populates="opciones")

