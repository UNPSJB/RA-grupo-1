from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.models import ModeloBase
from src.vinculaciones.models import Duracion 
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.informe_sintetico.models import InformeSintetico
    from src.resultado_informe.models import ResultadoInforme
    from src.carreras.models import Carrera


class InformeSinteticoFinalizado(ModeloBase):
    __tablename__ = "informe_sintetico_finalizado" 

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    contenido = Column(Text, nullable=False)
    anio: Mapped[int] = mapped_column(Integer, nullable=False)
    duracion: Mapped[Duracion] = mapped_column(Enum(Duracion), nullable=False)

    informe_base_id = Column(Integer, ForeignKey("informes_sinteticos.id"), nullable=False)

    informe_base: Mapped["InformeSintetico"] = relationship(
        "InformeSintetico", 
        back_populates="informes_finalizados"
    )

    respuestas: Mapped[List["ResultadoInforme"]] = relationship(
        "ResultadoInforme", 
        back_populates="informe_finalizado"
    )

    carrera_id: Mapped[int] = mapped_column(Integer, ForeignKey("carreras.id"), nullable=False)

    carrera: Mapped["Carrera"] = relationship(
        "src.carreras.models.Carrera",
        back_populates="informes_finalizados"
    )
