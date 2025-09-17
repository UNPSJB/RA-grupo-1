from sqlalchemy import Column, Integer, String
from src.database import Base

class Persona(Base):
    __tablename__ = "personas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    edad = Column(Integer)
    correo = Column(String)
