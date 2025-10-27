from sqlalchemy import Integer, ForeignKey, Text, String, Column, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.encuesta_finalizada.models import EncuestaFinalizada
    from src.preguntas.models import Pregunta
    from src.ciclos.models import CicloEncuesta

class Respuesta(ModeloBase):
    __tablename__ = "respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    respuesta_texto: Mapped[str | None] = mapped_column(String(150), nullable=True)
    opcion_id: Mapped[int] = mapped_column(ForeignKey("opciones.id"), nullable=True)
    encuesta_finalizada_id: Mapped[int] = mapped_column(ForeignKey("encuestas_finalizadas.id"))
    ciclo_id: Mapped[int] = mapped_column(ForeignKey("ciclos_encuesta.id"))


    #Relaciones 
    #alumno: Mapped["src.alumnos.models.Alumno"] = relationship(
    #"src.alumnos.models.Alumno",
    #back_populates="respuestas"
    #)
    #alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="respuestas")
    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")
    opcion: Mapped["Opcion"] = relationship("Opcion")
