from typing import Optional, List
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


class Persona(ModeloBase):
    __tablename__ = "personas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True, nullable=False)
    apellido: Mapped[str] = mapped_column(String(30), nullable=False)
    legajo: Mapped[int] = mapped_column(Integer, index=False)
    dni: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    rol: Mapped["Rol"] = relationship("Rol", back_populates="personas")
    alumno: Mapped[Optional["Alumno"]] = relationship("Alumno")
    docente: Mapped[Optional["Docente"]] = relationship("Docente")