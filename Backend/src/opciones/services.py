from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.opciones.models import Opcion
from src.opciones import schemas, exceptions

def crear_opcion(db: Session, opcion: schemas.OpcionCreate) -> schemas.Opcion:
    opcion_nueva = Opcion(**opcion.model_dump())
    db.add(opcion_nueva)
    db.commit()
    db.refresh(opcion_nueva)
    return opcion_nueva

def listar_opciones(db: Session) -> List[schemas.Opcion]:
    return db.scalars(select(Opcion)).all()

def recibir_opcion(db: Session, opcion_id: int) -> schemas.Opcion:
    db_opcion = db.scalar(select(Opcion).where(Opcion.id == opcion_id))
    if db_opcion is None:
        raise exceptions.OpcionNoEncontrada()
    return db_opcion 

def cambiar_opcion(db: Session, opcion_id: int, opcion: schemas.OpcionUpdate) -> schemas.Opcion:
    db_opcion = recibir_opcion(db, opcion_id)
    db.execute(update(Opcion).where(Opcion.id == opcion_id).values(**opcion.model_dump()))
    db.commit()
    db.refresh(db_opcion)
    return db_opcion

def eliminar_opcion(db: Session, opcion_id: int) -> schemas.OpcionDelete:
    db_opcion = recibir_opcion(db, opcion_id)

    if db_opcion.preguntas and len(db_opcion.preguntas) > 0:
        raise exceptions.OpcionNoEliminable()

    db.delete(db_opcion)
    db.commit()
    return db_opcion