from typing import Optional, List
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


class Persona(ModeloBase):
    __tablename__ = "personas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    apellido: Mapped[str] = mapped_column(String(30), index=False)
    legajo: Mapped[int] = mapped_column(Integer, index=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    rol_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

    rol: Mapped["Rol"] = relationship("Rol", back_populates="personas")