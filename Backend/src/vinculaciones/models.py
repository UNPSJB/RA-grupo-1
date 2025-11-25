from ast import For
from sqlalchemy import Integer, String, ForeignKey, Table, Column, Enum
from src.models import ModeloBase
from enum import auto, StrEnum

class Estado(StrEnum):
    pendiente = "pendiente"
    finalizado = "finalizado"

class Duracion(StrEnum):
    anual = "anual"
    cuatrimestre_1 = "primer cuatrimestre"
    cuatrimestre_2 = "segundo cuatrimestre"

asignatura_alumno = Table(
    "asignatura_alumno",
    ModeloBase.metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("alumno_id", ForeignKey("alumnos.id")),
    Column("asignatura_id", ForeignKey("asignaturas.id")),
    Column("nota_cursada", Integer),
    Column("anio", Integer),
    Column("duracion", String)
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

informe_catedra_asignatura = Table(
    "informe_catedra_asignatura",
    ModeloBase.metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("informe_catedra_id", ForeignKey("informe_catedra.id")),
    Column("asignatura_id", ForeignKey("asignaturas.id"))
)   

asignatura_carrera = Table(
    "asignatura_carrera",
    ModeloBase.metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("asignatura_id", ForeignKey("asignaturas.id")),
    Column("carrera_id", ForeignKey("carreras.id"))
)

