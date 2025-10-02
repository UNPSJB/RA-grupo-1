from __future__ import annotations 
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.opciones.models import Opcion
from src.vinculaciones.models import pregunta_opcion
from typing import TYPE_CHECKING

if TYPE_CHECKING:  
    from src.respuestas.models import Respuesta

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto: Mapped[str] = mapped_column(String(250), nullable=False)
    tipo: Mapped[str] = mapped_column(String(50), nullable=False, default="abierta")
    opciones: Mapped[list["Opcion"]] = relationship(
        "Opcion",
        secondary=pregunta_opcion,
        back_populates="preguntas"
    )
    respuestas: Mapped[list["Respuesta"]] = relationship(
        "Respuesta",
        back_populates="preguntas",
        cascade="all, delete-orphan"
    )