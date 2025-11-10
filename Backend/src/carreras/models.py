from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, TYPE_CHECKING, List

if TYPE_CHECKING:
    from src.departamentos.models import Departamento
    from src.informe_sintetico.models import InformeSintetico

class Carrera(ModeloBase):
    __tablename__ = "carreras"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"))
    
    departamento: Mapped["Departamento"] = relationship("Departamento", back_populates="carreras")
    informes_sinteticos: Mapped[List["InformeSintetico"]] = relationship(
        "InformeSintetico", back_populates="carrera"
    )
#relacion con informe sintentico
    informe_base = relationship("InformeSintetico", back_populates="carrera")
    informe_finalizado = relationship("InformeSinteticoFinalizado", back_populates="carrera")