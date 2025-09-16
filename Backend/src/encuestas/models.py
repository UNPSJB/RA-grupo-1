from sqlalchemy import Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, List

from src.models import ModeloBase, Base

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    descripcion: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    activa: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Relaciones (opcional)
    alumnos_asignados: Mapped[Optional[List["EncuestaAlumno"]]] = relationship(
        "EncuestaAlumno", back_populates="encuesta"
    )

class EncuestaAlumno(ModeloBase):
    __tablename__ = "encuestas_alumno"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    encuesta_id: Mapped[int] = mapped_column(Integer, ForeignKey("encuestas.id"))
    completada: Mapped[bool] = mapped_column(Boolean, default=False)
    fecha_completado: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relaciones
    alumno: Mapped["Alumno"] = relationship("Alumno", back_populates="encuestas_asignadas")
    encuesta: Mapped["Encuesta"] = relationship("Encuesta", back_populates="alumnos_asignados")

class RespuestaAlumno(ModeloBase): 
    __tablename__ = "respuestas_alumno"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alumno_id: Mapped[int] = mapped_column(Integer, ForeignKey("alumnos.id"))
    encuesta_id: Mapped[int] = mapped_column(Integer, ForeignKey("encuestas.id"))
    respuesta_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)