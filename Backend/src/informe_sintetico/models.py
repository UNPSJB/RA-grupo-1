from sqlalchemy import Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.carreras.models import Carrera

class InformeSintetico(ModeloBase):
    __tablename__ = "informes_sinteticos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    contenido: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[str] = mapped_column(Date, nullable=False)
    carrera_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("carreras.id"), nullable=True)

    carrera: Mapped["Carrera"] = relationship("Carrera", back_populates="informes_sinteticos")
