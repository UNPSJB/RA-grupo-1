from sqlalchemy import Column, Integer, String, Text, Date
from src.models import ModeloBase  

class InformeSintetico(ModeloBase):
    __tablename__ = "informes_sinteticos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)