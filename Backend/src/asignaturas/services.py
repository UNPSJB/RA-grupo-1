from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.asignaturas.models import Asignatura
from src.asignaturas import schemas, exceptions 


def listar_asignatura(db: Session) -> List[schemas.Asignatura]:
    return db.scalars(select(Asignatura)).all()

def leer_asignatura(db: Session, materia_id: int) -> schemas.Asignatura:
    db_asignatura = db.scalar(select(Asignatura).where(Asignatura.id == asignatura_id))
    if db_asignatura is None:
        raise exceptions.AsignaturaNoEncontrada()
    return db_asignatura