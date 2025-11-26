from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase  
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
    from src.asignaturas.models import Asignatura
    from src.categorias.models import Categoria

class InformeCatedra(ModeloBase):
    __tablename__ = "informe_catedra"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String, nullable=False)

    asignatura_id: Mapped[int] = mapped_column(Integer, ForeignKey("asignaturas.id"), nullable=False) 

    asignatura: Mapped["Asignatura"] = relationship(
        "Asignatura",
        back_populates="informes_catedra"  
    )

    informes_finalizados: Mapped[List["InformeCatedraFinalizado"]] = relationship(
    "InformeCatedraFinalizado",
    back_populates="informe_catedra"
    )   

    categorias: Mapped[Optional[List["Categoria"]]] = relationship(
    "Categoria",
    back_populates="informe_catedra")