from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.encuestas.models import Encuesta
from src.encuestas import schemas, exceptions

def listar_encuestas(db:Session) -> List[schemas.Encuesta]:
    return db.scalars(select(Encuesta)).all()


def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> schemas.Encuesta:
    _encuesta = Encuesta(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def leer_encuesta(db: Session, encuesta_id: int)-> schemas.Encuesta:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id == encuesta_id))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta


def modificar_encuesta(
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaUpdate) -> schemas.Encuesta:  # Cambiar Encuesta por schemas.Encuesta
    db_encuesta = leer_encuesta(db, encuesta_id)
    # Filtrar solo los campos que no son None
    update_data = encuesta.model_dump(exclude_unset=True)
    if update_data:  # Solo actualizar si hay datos
        db.execute(update(Encuesta).where(Encuesta.id == encuesta_id).values(**update_data))
        db.commit()
        db.refresh(db_encuesta)
    return db_encuesta

def eliminar_encuesta(db: Session, encuesta_id: int) -> dict:
    db_encuesta = leer_encuesta(db, encuesta_id)
    nombre_encuesta = db_encuesta.nombre
    db.delete(db_encuesta)
    db.commit()
    return {"message": f"Encuesta {nombre_encuesta} eliminada"}