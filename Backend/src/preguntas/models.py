from __future__ import annotations
from sqlalchemy import Integer, String, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
import enum
from typing import List, Optional


class TipoPreguntaEnum(str, enum.Enum):
    ABIERTA = "abierta"
    OPCION_MULTIPLE = "opcion_multiple"
    UNICA_OPCION = "unica_opcion"
    BOOLEANA = "booleana"


# -------------------------------------------------------------------
# SUBPREGUNTA (primero para que Pregunta la encuentre)
# -------------------------------------------------------------------
class Subpregunta(ModeloBase):
    __tablename__ = "subpreguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    opciones: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas.id", ondelete="CASCADE"))
    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="subpreguntas")


# -------------------------------------------------------------------
# PREGUNTA
# -------------------------------------------------------------------
class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    encuesta_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("encuestas.id", ondelete="CASCADE"))
    categoria_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("categorias.id", ondelete="SET NULL"), nullable=True)
    informe_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("informe_catedra.id"), nullable=True)
    nro_pregunta: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    encuesta_id: Mapped[int] = mapped_column(Integer, ForeignKey("encuestas.id"))

    tipo: Mapped[TipoPreguntaEnum] = mapped_column(
        String(250),
        nullable=False,
        default=TipoPreguntaEnum.ABIERTA
    )

    # RESPUESTAS
    respuestas: Mapped[List["Respuesta"]] = relationship(
        "Respuesta",
        back_populates="pregunta",
        lazy="select"
    )

    # OPCIONES
    opciones: Mapped[List["Opcion"]] = relationship(
        "Opcion",
        back_populates="pregunta",
        cascade="all, delete-orphan"
    )

    # CATEGORIA
    categoria_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("categorias.id", ondelete="SET NULL"),
        nullable=True
    )

    categoria: Mapped[Optional["Categoria"]] = relationship(
        "src.categorias.models.Categoria",
        back_populates="preguntas"
    )

    # ENCUESTA
    encuesta: Mapped["Encuesta"] = relationship(
        "src.encuestas.models.Encuesta",
        back_populates="preguntas"
    )

    # SUBPREGUNTAS
    subpreguntas: Mapped[Optional[List["Subpregunta"]]] = relationship(
        "Subpregunta",
        back_populates="pregunta",
        cascade="all, delete-orphan"
    )
