from sqlalchemy import Integer, Text, ForeignKey, Enum, Column, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.informe_sintetico.models import InformeSintetico
    from src.resultado_informe import ResultadoInforme

class PreguntaInformeSintetico(ModeloBase):
    __tablename__ = "preguntas_informe_sintetico"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, index=True)
    oracion = Column(Text, nullable=False) 
    orden = Column(Integer, nullable=False) 
    informe_base_id = Column(Integer, ForeignKey("informes_sinteticos.id"), nullable=False)

    informe_base: Mapped["InformeSintetico"] = relationship(
        "InformeSintetico",
        back_populates="preguntas"
    )
    
    respuestas: Mapped[List["ResultadoInforme"]] = relationship(
        "ResultadoInforme",
        back_populates="pregunta"
    )