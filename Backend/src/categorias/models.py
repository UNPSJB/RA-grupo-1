from sqlalchemy import Integer, String, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List
from src.asociaciones.models import pregunta_opcion

class Categoria(ModeloBase):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    cod: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    texto: Mapped[str] = mapped_column(String, nullable=False)
    encuesta_id: Mapped[int] = mapped_column(
        ForeignKey("encuestas.id")
    )  # Foreign key a Encuesta

    encuesta: Mapped["src.encuestas.models.Encuesta"] = relationship(
        "src.encuestas.models.Encuesta", back_populates="categorias"
    )

    preguntas: Mapped[Optional[List["src.preguntas.models.Pregunta"]]] = relationship(
        "src.preguntas.models.Pregunta",
        back_populates="categoria"
    )


    