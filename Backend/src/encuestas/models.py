from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from src.models import ModeloBase
from src.vinculaciones.models import alumno_encuesta, Duracion

class EstadoEncuesta(str, Enum):
    abierta = "abierta"
    cerrada = "cerrada"

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    carrera: Mapped[str] = mapped_column(String, index=True)
    asignatura: Mapped[str] = mapped_column(String, index=True)
    cursado: Mapped[Duracion] = mapped_column(Enum(Duracion), nullable=False)
    año: Mapped[int] = mapped_column(Integer, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)    
    fecha_inicio: Mapped[str] = mapped_column(String, index=True)
    fecha_fin: Mapped[str] = mapped_column(String, index=True) 
    estado: Mapped[EstadoEncuesta] = mapped_column(Enum(EstadoEncuesta), nullable=False, default=EstadoEncuesta.abierta)
    titulo: Mapped[str] = mapped_column(String, nullable=False)
    fecha_inicio: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    fecha_fin: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    
    asignatura_id: Mapped[int] = mapped_column(Integer, ForeignKey("asignaturas.id"))
    
    
    asignatura: Mapped["Asignatura"] = relationship(
        "Asignatura", back_populates="encuestas"
    )

    
    alumnos: Mapped[list["Alumno"]] = relationship(
        "Alumno", secondary=alumno_encuesta, back_populates="encuestas"
    )


""" class EncuestaAlumno(ModeloBase):
    __tablename__ = "encuesta_alumno"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(ForeignKey("alumnos.id"))
    encuesta_id: Mapped[int] = mapped_column(ForeignKey("encuestas.id"))
    fecha_respuesta: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


    alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="encuestas")
    encuesta: Mapped["Encuesta"] = relationship("Encuesta", back_populates="alumnos") """


