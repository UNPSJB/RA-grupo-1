from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, TYPE_CHECKING, List
<<<<<<< HEAD
from src.vinculaciones.models import asignatura_carrera
=======
>>>>>>> 36acc76b4cd641a710ecc46f4ba0eb0e155d4010

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
    informes_finalizados = Mapped[Optional[List["src.informe_sintetico_finalizado.models.InformeSinteticoFinalizado"]]] = relationship("src.informe_sinteticoFinalizado", back_populates="carrera") 

    informe_base_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("informes_sinteticos_base.id"), nullable=True)
    asignaturas: Mapped[Optional[List["src.asignaturas.models.Asignatura"]]] = relationship(
        "src.materias.models.Materia",
        secondary=asignatura_carrera,
        back_populates="carreras"
    )