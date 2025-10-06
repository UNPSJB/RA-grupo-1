from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase


class Materia(ModeloBase):
    __tablename__ = "materias"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    docente_id: Mapped[int] = mapped_column(Integer, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    codigo_materia: Mapped[str] = mapped_column(String, unique=True, index=True)
    