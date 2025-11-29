from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Mapped, relationship
from typing import List, TYPE_CHECKING
from src.models import ModeloBase

if TYPE_CHECKING:
    from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
    from src.categorias.models import Categoria


class InformeCatedra(ModeloBase):
    __tablename__ = "informe_catedra"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)

    # Informes finalizados que usan esta plantilla
    informes_finalizados: Mapped[List["InformeCatedraFinalizado"]] = relationship(
        "InformeCatedraFinalizado",
        back_populates="informe_catedra"
    )

    # Categorías del formulario
    categorias: Mapped[List["Categoria"]] = relationship(
        "Categoria",
        back_populates="informe_catedra"
    )
