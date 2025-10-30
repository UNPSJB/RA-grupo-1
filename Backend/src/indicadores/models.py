from sqlalchemy import Integer, Float, String, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List

class IndicadoresInforme(ModeloBase):
    __tablename__ = "indicadores_informe"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_informe_catedra_finalizado: Mapped[int] = mapped_column(
        ForeignKey("informe_catedra_finalizado.id"), index=True
    )

    id_pregunta_encuesta: Mapped[int] = mapped_column(
        ForeignKey("preguntas.id"), index=True
    )

    datos_pregunta: Mapped[Optional[List["IndicadoresPregunta"]]] = relationship(
        "IndicadoresPregunta",
        back_populates="informe"
    )


class IndicadoresPregunta(ModeloBase):
    __tablename__ = "indicadores_pregunta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_indicadores_informe: Mapped[int] = mapped_column(
        ForeignKey("indicadores_informe.id"), index=True
    )

    id_opcion: Mapped[int] = mapped_column(ForeignKey("opciones.id"), index=True)
    porcentaje: Mapped[float] = mapped_column(Float)

    informe: Mapped["indicadores_informe"] = relationship(
        "IndicadoresInforme",
        back_populates="datos_pregunta"
    )