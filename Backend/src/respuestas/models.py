from sqlalchemy import Integer, ForeignKey, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.encuestas_completadas.models import EncuestaCompletada
    from src.preguntas.models import Pregunta

class Respuesta(ModeloBase):
    __tablename__ = "respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    
    respuesta_texto: Mapped[str | None] = mapped_column(String(150), nullable=True)
    opcion_id: Mapped[int] = mapped_column(ForeignKey("opciones.id"), nullable=True)
    encuesta_completada_id: Mapped[int] = mapped_column(ForeignKey("encuestas_completadas.id"))
    encuesta_completada: Mapped["EncuestaCompletada"] = relationship("EncuestaCompletada", back_populates="respuestas")

    
    # RELACIONES 
    # pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")  
    # alumno = relationship("Alumno", back_populates="respuestas", lazy="select")
    # opcion: Mapped["Opcion"] = relationship("Opcion")