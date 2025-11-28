from token import OP
from sqlalchemy import Column, Integer, String, Text, Date,Enum,ForeignKey
from src.models import ModeloBase  
from sqlalchemy.orm import Mapped, mapped_column, relationship
#from src.vinculaciones.models import informe_catedra_asignatura
#from src.informe_catedra_finalizado.models import InformeCatedraFinalizado 
#from src.asignaturas.models import Asignatura 
#from src.categorias.models import Categoria
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
    from src.asignaturas.models import Asignatura
    from src.categorias.models import Categoria

class InformeCatedra(ModeloBase):
    __tablename__ = "informe_catedra"

    id = Column(Integer, primary_key=True, index=True)
    informes_finalizados: Mapped[List["InformeCatedraFinalizado"]] = relationship(
    "InformeCatedraFinalizado",
    back_populates="informe_catedra"
    )

    asignaturas: Mapped[Optional[List["Asignatura"]]] = relationship(
        "Asignatura",
        back_populates="informe_catedra"  
    )

    categorias: Mapped[Optional[List["Categoria"]]] = relationship(
    "Categoria",
    back_populates="informe_catedra") 
    titulo = Column(String, nullable=False)