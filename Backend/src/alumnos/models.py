from sqlalchemy import Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, List

from src.models import ModeloBase

class Alumno(ModeloBase):
    __tablename__ = "alumnos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(150), index=True)
    apellido: Mapped[str] = mapped_column(String(150), index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    
    
    encuestas_asignadas: Mapped[Optional[List["src.encuestas.models.EncuestaAlumno"]]] = relationship(
        "src.encuestas.models.EncuestaAlumno", back_populates="alumno"
    )
    respuestas: Mapped[Optional[List["src.encuestas.models.RespuestaAlumno"]]] = relationship(
        "src.encuestas.models.RespuestaAlumno"
    )