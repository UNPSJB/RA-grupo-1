from sqlalchemy.orm import Mapped, relationship
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta
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
    
agregar_relationships()