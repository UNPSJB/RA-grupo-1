from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.preguntas.models import Pregunta
    from src.opciones.models import Opcion
    from src.informe_catedra_finalizado.models import InformeCatedraFinalizado

class ResultadoInforme(ModeloBase):
    __tablename__ = "resultado_informe"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    opcion_id: Mapped[int] = mapped_column(ForeignKey("opciones.id"), nullable=True)
    informe_catedra_finalizado_id: Mapped[int] = mapped_column(ForeignKey("informe_catedra_finalizado.id"))

    texto_respuesta: Mapped[str | None] = mapped_column(String(150), nullable=True)
    
    pregunta: Mapped["Pregunta"] = relationship("Pregunta")
    opcion: Mapped["Opcion"] = relationship("Opcion")
    informe_catedra_finalizado: Mapped["InformeCatedraFinalizado"] = relationship("InformeCatedraFinalizado", back_populates="resultado_informe")