from typing import Optional, List
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase


class Persona(ModeloBase):
    __tablename__ = "personas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)