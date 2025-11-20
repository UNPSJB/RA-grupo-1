from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List
from src.encuestas.models import Encuesta
from src.preguntas.models import Pregunta

class Categoria(ModeloBase):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    codigo: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    texto: Mapped[str] = mapped_column(String, nullable=False)
    encuesta_id: Mapped[int] = mapped_column(
        ForeignKey("encuestas.id")
    )  

    encuesta: Mapped["Encuesta"] = relationship(
        "src.encuestas.models.Encuesta", back_populates="categorias"
    )

    preguntas: Mapped[Optional[List["Pregunta"]]] = relationship(
        "src.preguntas.models.Pregunta",
        back_populates="categoria"
    )

    informe_catedra_id: Mapped[Optional[int]] = mapped_column(
    ForeignKey("informe_catedra.id")
    )

    informe_catedra: Mapped[Optional["InformeCatedra"]] = relationship(
    "src.informe_catedra.models.InformeCatedra",
    back_populates="categorias"
    )


    