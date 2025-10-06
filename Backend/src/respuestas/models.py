from datetime import datetime
from enum import Enum
from sqlalchemy import Integer, Float, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class OpcionRespuesta(str, Enum):
    respLarga = "respuesta larga"; respCategorica = "respuesta categorica"

class Respuesta(ModeloBase):
    __tablename__ = "respuestas_estudiantes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    estudiante_id: Mapped[int] = mapped_column(Integer, index=True)
    encuesta_id: Mapped[int] = mapped_column(Integer, index=True)
    pregunta_id: Mapped[int] = mapped_column(Integer, index=True)
    opcion: Mapped[OpcionRespuesta | None] = mapped_column(SQLEnum(OpcionRespuesta, name="opcion_respuesta"), nullable=True, index=True)
    valor_numerico: Mapped[float | None] = mapped_column(Float, nullable=True)
    respondido_at: Mapped[datetime] = mapped_column(DateTime, default=datetime)