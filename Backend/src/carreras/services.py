from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session, aliased
from sqlalchemy.sql import not_ 
from src.carreras.models import Carrera
from src.carreras import schemas, exceptions
from src.informe_sintetico_finalizado.models import InformeSinteticoFinalizado
from src.constants import ANIO_ACTUAL, DURACION_ACTUAL  

def crear_carrera(db: Session, carrera: schemas.CarreraBase) -> schemas.Carrera:
    db_carrera = Carrera(**carrera.model_dump())
    db.add(db_carrera)
    db.commit()
    db.refresh(db_carrera)
    return db_carrera


def leer_carrera(db: Session, carrera_id: int) -> schemas.Carrera:
    db_carrera = db.scalar(select(Carrera).where(Carrera.id == carrera_id))
    if db_carrera is None:
        raise exceptions.CarreraNoEncontrada()
    return db_carrera

def listar_carreras(db: Session) -> List[schemas.Carrera]:
    return db.scalars(select(Carrera).order_by(Carrera.nombre)).all()

def listar_carreras_por_departamento(db: Session, departamento_id: int) -> List[schemas.Carrera]:
    return db.scalars(select(Carrera).where(Carrera.departamento_id == departamento_id)).all()

def informes_sinteticos_pendientes(db: Session, departamento_id: int) -> List[schemas.Carrera]:
    descarte=(
        select(InformeSinteticoFinalizado.carrera_id)
        .where(InformeSinteticoFinalizado.anio == ANIO_ACTUAL)
        .where(InformeSinteticoFinalizado.duracion == DURACION_ACTUAL)
    )
    stmt=(
        select(Carrera)
        .where(Carrera.departamento_id == departamento_id)
        .where(Carrera.id.not_in(descarte))
    )
    return db.scalars(stmt).all()
