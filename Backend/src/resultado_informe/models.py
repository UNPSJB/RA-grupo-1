from sqlalchemy import Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, relationship, mapped_column
from src.models import ModeloBase
from typing import Optional
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.pregunta_informe_sintetico.models import PreguntaInformeSintetico
    from src.informe_sintetico_finalizado.models import InformeSinteticoFinalizado
    from src.informe_catedra_finalizado.models import InformeCatedraFinalizado

class ResultadoInforme(ModeloBase):
    __tablename__ = "resultado_informe"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto_respuesta: Mapped[str] = mapped_column(Text, nullable=False)
    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas_informe_sintetico.id"), nullable=False)
    asignatura_id: Mapped[int] = mapped_column(Integer, ForeignKey("informe_sintetico_finalizado.id"), nullable=False)
    informe_catedra_finalizado_id: Mapped[int] = mapped_column(Integer, ForeignKey("informe_catedra_finalizado.id"),nullable=True,)
    
    pregunta: Mapped["PreguntaInformeSintetico"] = relationship(
        "PreguntaInformeSintetico", 
        back_populates="respuestas"
    )
    
    informe_finalizado: Mapped["InformeSinteticoFinalizado"] = relationship(
        "InformeSinteticoFinalizado", 
        back_populates="respuestas",
        foreign_keys=[asignatura_id]  
    )
    
    informe_catedra_finalizado: Mapped["InformeCatedraFinalizado"] = relationship(
        "InformeCatedraFinalizado", 
        back_populates="resultado_informe"
    )