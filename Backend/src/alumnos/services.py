from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.alumnos.models import Alumno
from src.alumnos import schemas, exceptions

# operaciones CRUD para alumnos

def crear_alumno(db: Session, alumno: schemas.AlumnoCreate) -> schemas.Alumno:
    _alumno = Alumno(**alumno.model_dump())
    db.add(_alumno)
    db.commit()
    db.refresh(_alumno)
    return _alumno


def listar_alumnos(db: Session) -> List[schemas.Alumno]:
    return db.scalars(select(Alumno)).all()


def leer_alumno(db: Session, alumno_id: int) -> schemas.Alumno:
    db_alumno = db.scalar(select(Alumno).where(Alumno.id == alumno_id))
    if db_alumno is None:
        raise exceptions.AlumnoNoEncontrada()
    return db_alumno


def modificar_alumno(
    db: Session, alumno_id: int, alumno: schemas.AlumnoUpdate) -> Alumno:
    db_alumno = leer_alumno(db, alumno_id)
    db.execute(update(Alumno).where(Alumno.id == alumno_id).values(**alumno.model_dump()))
    db.commit()
    db.refresh(db_alumno)
    return db_alumno


def eliminar_alumno(db: Session, alumno_id: int) -> dict:
    db_alumno = leer_alumno(db, alumno_id)
    nombre_alumno = db_alumno.nombre
    db.delete(db_alumno)
    db.commit()
    return {"message": f"alumno {nombre_alumno} eliminado"}