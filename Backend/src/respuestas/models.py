from sqlalchemy import Integer, ForeignKey, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
<<<<<<< HEAD
from src.models import ModeloBase
=======
>>>>>>> 17f9bfd0057ca1f072f560b53f86d560fa9ce7e8
from typing import Optional, TYPE_CHECKING
from src.models import ModeloBase  # 👈 coherente con el resto de los modelos

if TYPE_CHECKING:
    from src.encuesta_finalizada.models import EncuestaFinalizada
    from src.preguntas.models import Pregunta
<<<<<<< HEAD
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

    
    # RELACIONES 
    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")  
    alumno = relationship("Alumno", back_populates="respuestas", lazy="select")
    opcion: Mapped["Opcion"] = relationship("Opcion")
    encuesta_finalizada: Mapped["EncuestaFinalizada"] = relationship("EncuestaFinalizada", back_populates="respuestas")
    ciclo: Mapped["CicloEncuesta"] = relationship("CicloEncuesta", back_populates="respuestas")
=======
    from src.alumnos.models import Alumno
    from src.opciones.models import Opcion

class Respuesta(ModeloBase):
    __tablename__ = "respuestas_estudiantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas.id"), nullable=False)

    # Campos para diferentes tipos de respuesta
    respuesta_texto: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    opcion_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("opciones.id"), nullable=True)

    progreso: Mapped[int] = mapped_column(Integer, default=0)

    # Relaciones
    alumno: Mapped[Optional["Alumno"]] = relationship("Alumno", lazy="joined")
    pregunta: Mapped["Pregunta"] = relationship("Pregunta", back_populates="respuestas")
    opcion: Mapped[Optional["Opcion"]] = relationship("Opcion")
>>>>>>> 17f9bfd0057ca1f072f560b53f86d560fa9ce7e8
