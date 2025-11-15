from __future__ import annotations 
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.vinculaciones.models import pregunta_opcion
import enum
from typing import List, Optional

class TipoPreguntaEnum(str, enum.Enum):
    ABIERTA = "abierta"
    OPCION_MULTIPLE = "opcion_multiple"
    UNICA_OPCION = "unica_opcion"
    BOOLEANA = "booleana"

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    encuesta_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("encuestas.id"))
    categoria_id: Mapped[int] = mapped_column(Integer, ForeignKey("categorias.id"), nullable=True)
    informe_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("informe_sintetico.id" or "informe_catedra.id"), nullable=True)
    nro_pregunta: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    
    tipo: Mapped[TipoPreguntaEnum] = mapped_column(
        String(50), 
        nullable=False, 
        default=TipoPreguntaEnum.ABIERTA
    )

    # RELACIÓN 
    respuestas = relationship("Respuesta", back_populates="pregunta", lazy="select")

    opciones = relationship("Opcion", back_populates="pregunta", cascade="all, delete-orphan")

    categoria: Mapped["Categoria"] = relationship(
        "src.categorias.models.Categoria",
        back_populates="preguntas"
    )