from sqlalchemy import Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase  
from typing import List, Optional

class InformeSintetico(ModeloBase):
    __tablename__ = "informe_sintetico"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    contenido: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[str] = mapped_column(Date, nullable=False)
    carrera_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("carreras.id"), nullable=True)

    carrera: Mapped["Carrera"] = relationship("Carrera", back_populates="informes_sinteticos")
    preguntas: Mapped[List["PreguntaInformeSintetico"]] = relationship(
        "PreguntaInformeSintetico", back_populates="informe_base"
    )
    informes_finalizados: Mapped[List["InformeSinteticoFinalizado"]] = relationship(
        "InformeSinteticoFinalizado", back_populates="informe_base"
    )
