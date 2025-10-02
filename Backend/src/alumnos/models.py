from sqlalchemy import Integer, String, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List
from src.vinculaciones.models import alumno_asignatura, alumno_encuesta

class Alumno(ModeloBase):
    __tablename__ = "alumnos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    CUIL: Mapped[String] = mapped_column(String, index=True)
    nombre: Mapped[String] = mapped_column(String, index=True)
    apellido: Mapped[String] = mapped_column(String, index=True)
    usuario: Mapped[String] = mapped_column(String, index=True)
    clave: Mapped[String] = mapped_column(String, index=True)
    
    asignaturas: Mapped[Optional[List["Asignatura"]]] = relationship(
        "Asignatura",
        secondary=alumno_asignatura,
        back_populates="alumnos"
    )

    encuestas: Mapped[Optional[List["Encuesta"]]] = relationship(
        "Encuesta",
        secondary=alumno_encuesta,
        back_populates="alumnos"
    )