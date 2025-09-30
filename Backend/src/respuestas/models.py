from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base

class RespuestaEstudiante(Base):
    __tablename__ = "respuestas_estudiantes"
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"))
    encuesta_id = Column(Integer, ForeignKey("encuestas.id"))
    respuesta_texto = Column(String, nullable=True)
    opcion_multiple = Column(String, nullable=True)
    progreso = Column(Integer, default=0)
