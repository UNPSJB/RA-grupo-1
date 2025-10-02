from __future__ import annotations
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.preguntas.models import Pregunta

class Opcion(ModeloBase):
    __tablename__ = "opciones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(100),primary_key=False, nullable=False)

    preguntas: Mapped[list["Pregunta"]] = relationship(
        "Pregunta",
        secondary="pregunta_opcion",
        back_populates="opciones"
    )