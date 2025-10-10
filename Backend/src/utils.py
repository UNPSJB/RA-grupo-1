from sqlalchemy.orm import Mapped, relationship
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.personas.models import Persona
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
    
agregar_relationships()