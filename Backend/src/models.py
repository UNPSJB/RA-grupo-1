from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Estudiante(Base):
    __tablename__ = "estudiantes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)

    respuestas = relationship("RespuestaEstudiante", back_populates="estudiante")


class Materia(Base):
    __tablename__ = "materias"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    encuestas = relationship("Encuesta", back_populates="materia")


class Encuesta(Base):
    __tablename__ = "encuestas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    activa = Column(Boolean, default=True)
    materia_id = Column(Integer, ForeignKey("materias.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    materia = relationship("Materia", back_populates="encuestas")
    respuestas = relationship("RespuestaEstudiante", back_populates="encuesta")


class RespuestaEstudiante(Base):
    __tablename__ = "respuestas_estudiantes"
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"))
    encuesta_id = Column(Integer, ForeignKey("encuestas.id"))
    respuesta_texto = Column(String, nullable=True)  # respuesta libre
    opcion_multiple = Column(String, nullable=True) # ej: "A,B,D"
    progreso = Column(Integer, default=0)            # % de avance

    estudiante = relationship("Estudiante", back_populates="respuestas")
    encuesta = relationship("Encuesta", back_populates="respuestas")
