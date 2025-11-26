from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.departamentos.models import Departamento


class Sede(ModeloBase):
    __tablename__ = "sedes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, nullable=False, unique=True)

    departamentos: Mapped[List["Departamento"]] = relationship(back_populates="sede")