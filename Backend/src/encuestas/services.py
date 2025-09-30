from sqlalchemy.orm import Session
from src import models
from . import schemas
from datetime import datetime

def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate):
    db_encuesta = models.Encuesta(**encuesta.dict())
    db.add(db_encuesta)
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def responder_encuesta(db: Session, respuesta: schemas.RespuestaCreate):
    # validar periodo activo
    encuesta = db.query(models.Encuesta).filter(models.Encuesta.id == respuesta.encuesta_id).first()
    if not encuesta or not encuesta.activa:
        raise Exception("Encuesta no activa o no encontrada")

    if not (encuesta.fecha_inicio <= datetime.utcnow() <= encuesta.fecha_fin):
        raise Exception("Encuesta fuera de período")

    db_respuesta = models.RespuestaEstudiante(
        estudiante_id=respuesta.estudiante_id,
        encuesta_id=respuesta.encuesta_id,
        respuesta_texto=respuesta.respuesta_texto,
        progreso=50  # Ejemplo de actualización automática
    )
    db.add(db_respuesta)
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta
