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
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaUpdate) -> Encuesta:
    db_encuesta = leer_encuesta(db, encuesta_id)
    db.execute(update(Encuesta).where(Encuesta.id == encuesta_id).values(**encuesta.model_dump()))
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def eliminar_encuesta(db: Session, encuesta_id: int) -> dict:
    db_encuesta = leer_encuesta(db, encuesta_id)
    nombre_encuesta = db_encuesta.nombre
    db.delete(db_encuesta)

    db.commit()
    return {"message": f"Encuesta {nombre_encuesta} eliminada"}

def responder_encuesta(db: Session, respuesta: schemas.RespuestaCreate):
    encuesta = db.query(models.Encuesta).filter(models.Encuesta.id == respuesta.encuesta_id).first()
    if not encuesta or not encuesta.activa:
        raise Exception("Encuesta no activa o no encontrada")

    if not (encuesta.fecha_inicio <= datetime.utcnow() <= encuesta.fecha_fin):
        raise Exception("Encuesta fuera de período")

    db_respuesta = models.RespuestaEstudiante(
        estudiante_id=respuesta.estudiante_id,
        encuesta_id=respuesta.encuesta_id,
        respuesta_texto=respuesta.respuesta_texto,
        progreso=50  
    )
    db.add(db_respuesta)