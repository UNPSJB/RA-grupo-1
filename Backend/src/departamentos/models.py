from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.carreras.models import Carrera

class Departamento(ModeloBase):
    __tablename__ = "departamentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

    carreras: Mapped[Optional[List["Carrera"]]] = relationship("Carrera",back_populates="departamento")