from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from src.models import ModeloBase  

class CicloEncuesta(ModeloBase):
    __tablename__ = "ciclos_encuesta"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha_inicio = Column(DateTime, nullable=True)
    fecha_fin = Column(DateTime, nullable=True)
    activo = Column(Boolean, default=False)
    creado_en = Column(DateTime, default=datetime.utcnow)

# relacion con Respuesta un ciclo puede tener muchas respuestas, pero una respuesta pertenece a un ciclo
    #respuestas = relationship("Respuesta", back_populates="ciclo")
