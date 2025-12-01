from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, TYPE_CHECKING, List
from src.vinculaciones.models import asignatura_carrera

if TYPE_CHECKING:
    from src.departamentos.models import Departamento
    from src.informe_sintetico.models import InformeSintetico
    from src.asignaturas.models import Asignatura
    from src.informe_sintetico_finalizado.models import InformeSinteticoFinalizado

class Carrera(ModeloBase):
    __tablename__ = "carreras"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    departamento_id: Mapped[int] = mapped_column(Integer, ForeignKey("departamentos.id"))
    
    departamento: Mapped["Departamento"] = relationship("Departamento", back_populates="carreras")

    # Relación uno a muchos con informes sintéticos
    informes_sinteticos: Mapped[List["InformeSintetico"]] = relationship(
        "InformeSintetico", back_populates="carrera"
    )

    informes_finalizados: Mapped[Optional[List["InformeSinteticoFinalizado"]]] = relationship(
        "InformeSinteticoFinalizado", back_populates="carrera"
    )

    asignaturas: Mapped[Optional[List["Asignatura"]]] = relationship(
        "Asignatura",
        secondary=asignatura_carrera,
        back_populates="carreras"
    )
