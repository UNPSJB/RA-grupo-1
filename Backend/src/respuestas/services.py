from sqlalchemy import select, update
from sqlalchemy.orm import Session
from collections import Counter
from typing import List, Optional, Dict
from src.respuestas import schemas
from src.respuestas.models import Respuesta as RespuestaModel, OpcionRespuesta
from src.encuestas.models import Encuesta as EncuestaModel

def listar_respuestas(db: Session) -> List[schemas.Respuesta]:
    return db.scalars(select(RespuestaModel)).all()


def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> schemas.Respuesta:
    _respuesta = RespuestaModel(**respuesta.model_dump())
    db.add(_respuesta)
    db.commit()
    db.refresh(_respuesta)
    return _respuesta


def leer_respuesta(db: Session, respuesta_id: int) -> schemas.Respuesta:
    return db.scalar(select(RespuestaModel).where(RespuestaModel.id == respuesta_id))


def modificar_respuesta(
    db: Session, respuesta_id: int, respuesta: schemas.RespuestaUpdate) -> schemas.Respuesta:
    db_respuesta = leer_respuesta(db, respuesta_id)
    db.execute(update(RespuestaModel).where(RespuestaModel.id == respuesta_id).values(**respuesta.model_dump()))
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta


def eliminar_respuesta(db: Session, respuesta_id: int) -> dict:
    db_respuesta = leer_respuesta(db, respuesta_id)
    db.delete(db_respuesta)
    db.commit()
    return {"message": f"Respuesta {respuesta_id} eliminada"}
