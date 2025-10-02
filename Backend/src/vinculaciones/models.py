from sqlalchemy import Integer, String, ForeignKey, Table, Column, Enum
from src.models import ModeloBase
from enum import auto, StrEnum

class Duracion(StrEnum):
    ANUAL = "ANUAL"
    CUATRIMESTRE_1 = "PRIMER_CUATRIMESTRE"
    CUATRIMESTRE_2 = "SEGUNDO_CUATRIMESTRE"

alumno_asignatura = Table(
    "alumno_asignatura",
    ModeloBase.metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("alumno_id", ForeignKey("alumnos.id")),
    Column("asignatura_id", ForeignKey("asignaturas.id")),
    Column("nota_cursada", Integer),
    Column("anio", Integer),
    Column("periodo", String)
)

pregunta_opcion = Table(
    "pregunta_opcion",
    ModeloBase.metadata,
    Column("pregunta_id", ForeignKey("preguntas.id"), primary_key=True),
    Column("opcion_id", ForeignKey("opciones.id"), primary_key=True)
)

alumno_encuesta = Table(
    'alumno_encuesta',
    ModeloBase.metadata,
    Column('alumno_id', Integer, ForeignKey('alumnos.id'), primary_key=True),
    Column('encuesta_id', Integer, ForeignKey('encuestas.id'), primary_key=True)
)