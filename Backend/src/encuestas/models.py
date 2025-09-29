from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database import Base

class Encuesta(Base):
    __tablename__ = "encuestas"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    activa = Column(Boolean, default=True)
    materia_id = Column(Integer, ForeignKey("materias.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
