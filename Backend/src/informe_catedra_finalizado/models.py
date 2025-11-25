from sqlalchemy import Integer, ForeignKey, Enum, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from src.vinculaciones.models import Duracion, Estado
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
    from src.informe_catedra.models import InformeCatedra
    from src.resultado_informe.models import ResultadoInforme
    from src.respuestas_informe.models import RespuestaInforme

class InformeCatedraFinalizado(ModeloBase):
   __tablename__ = "informe_catedra_finalizado"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
   asignatura_docente_id: Mapped[int] = mapped_column(ForeignKey("asignatura_docente.id"))
   informe_catedra_id: Mapped[int] = mapped_column(ForeignKey("informe_catedra.id"))
   
   titulo: Mapped[Optional[str]] = mapped_column(String, nullable=True)
   contenido: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
   cantidadAlumnos: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
   
   anio: Mapped[int] = mapped_column(Integer, nullable=True)
   duracion: Mapped[Duracion] = mapped_column(Enum(Duracion), nullable=True)
   cantidadComisionesTeoricas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
   cantidadComisionesPracticas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

   JTP: Mapped[Optional[str]] = mapped_column(String, nullable=True)
   aux_primera: Mapped[Optional[str]] = mapped_column(String, nullable=True)
   aux_segunda: Mapped[Optional[str]] = mapped_column(String, nullable=True)

   estado: Mapped[Estado] = mapped_column(Enum(Estado), default=Estado.pendiente, nullable=False)

   asignatura_docente: Mapped["AsignaturaDocente"] = relationship("AsignaturaDocente")
   informe_catedra: Mapped["InformeCatedra"] = relationship(
      "InformeCatedra", 
      back_populates="informes_finalizados"
   )
   resultado_informe: Mapped[List["ResultadoInforme"]] = relationship(
      "ResultadoInforme", 
      back_populates="informe_catedra_finalizado"
   )

   respuestas_informe: Mapped[List["RespuestaInforme"]] = relationship(
      "RespuestaInforme", 
      back_populates="informe_catedra_finalizado"
   )