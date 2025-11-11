from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from src.models import ModeloBase  
from typing import List, Optional

class InformeSintetico(ModeloBase):
    __tablename__ = "informe_sintetico"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)

    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=True)
    carrera = relationship("Carrera", back_populates="informe_base")

    preguntas: Mapped[List["PreguntaInformeSintetico"]] = relationship(
        "PreguntaInformeSintetico",
        back_populates="informe_base"
    )

    informes_finalizados: Mapped[List["InformeSinteticoFinalizado"]] = relationship(
        "InformeSinteticoFinalizado",
        back_populates="informe_base"
    )

    carreras: Mapped[List["Carrera"]] = relationship(
        "Carrera",
        back_populates="informe_base"
    )