from sqlalchemy.orm import Mapped, relationship
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.personas.models import Persona
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.informe_catedra.models import InformeCatedra
from src.resultado_informe.models import ResultadoInforme
from typing import List

def agregar_relationships():
    Pregunta.respuestas: Mapped[List[Respuesta]] = relationship(
        Respuesta,
        back_populates="preguntas",
        cascade="all, delete-orphan")

    Respuesta.preguntas: Mapped[List[Pregunta]] = relationship(
        Pregunta, 
        back_populates="respuestas", 
        cascade="all, delete-orphan")

    Persona.alumno: Mapped[Alumno] = relationship(
        Alumno, 
        back_populates="persona", 
        cascade="all, delete-orphan")
    
    Alumno.persona: Mapped[Persona] = relationship(
        Persona, 
        back_populates="persona", 
        cascade="all, delete-orphan")
    
    Persona.docente: Mapped[Docente] = relationship(
        Docente, 
        back_populates="persona", 
        cascade="all, delete-orphan")
    
    Docente.persona: Mapped[Persona] = relationship(
        Persona, 
        back_populates="persona", 
        cascade="all, delete-orphan")

    Respuesta.encuesta_finalizada: Mapped["EncuestaFinalizada"] = relationship(
        "EncuestaFinalizada", 
        back_populates="respuestas"
    )
    
    EncuestaFinalizada.respuestas: Mapped[List["Respuesta"]] = relationship(
        "Respuesta", 
        back_populates="encuesta_finalizada",
        cascade="all, delete-orphan"
    )

    InformeCatedraFinalizado.informe_catedra: Mapped["InformeCatedra"] = relationship(
        "InformeCatedra", 
        back_populates="informes_finalizados"
    )
    
    InformeCatedra.informes_finalizados: Mapped[List["InformeCatedraFinalizado"]] = relationship(
        "InformeCatedraFinalizado",
        back_populates="informe_catedra"
    )
    
    InformeCatedraFinalizado.resultado_informe: Mapped[List["ResultadoInforme"]] = relationship(
        "ResultadoInforme", 
        back_populates="informe_catedra_finalizado"
    )
    
    ResultadoInforme.informe_catedra_finalizado: Mapped["InformeCatedraFinalizado"] = relationship(
        "InformeCatedraFinalizado", 
        back_populates="resultado_informe"
    )

    
agregar_relationships()