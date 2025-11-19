from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.carreras.models import Carrera
from src.carreras import schemas, exceptions

def leer_carrera(db: Session, carrera_id: int) -> schemas.Carrera:
    db_carrera = db.scalar(select(Carrera).where(Carrera.id == carrera_id))
    if db_carrera is None:
        raise exceptions.CarreraNoEncontrada()
    return db_carrera

def listar_carreras(db: Session) -> List[schemas.Carrera]:
    return db.scalars(select(Carrera)).all()

def listar_carreras_por_departamento(db: Session, departamento_id: int) -> List[schemas.Carrera]:
    return db.scalars(select(Carrera).where(Carrera.departamento_id == departamento_id)).all()