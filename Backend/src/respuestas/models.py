from sqlalchemy import Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database import Base


class Respuesta(Base):
    __tablename__ = "respuestas_estudiantes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id"))
    respuesta_texto: Mapped[str] = mapped_column(String, nullable=True)
    opcion_multiple: Mapped[str] = mapped_column(String, nullable=True)
    progreso: Mapped[int] = mapped_column(Integer, default=0)
    pregunta_id: Mapped[int] = mapped_column(Integer, ForeignKey("preguntas.id"), nullable=False)
