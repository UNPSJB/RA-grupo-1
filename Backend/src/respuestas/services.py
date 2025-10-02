from sqlalchemy.orm import Session
from datetime import datetime
from . import models, schemas
from src.encuestas.models import Encuesta

def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate):
    # validar encuesta
    encuesta = db.query(Encuesta).filter(Encuesta.id == respuesta.encuesta_id).first()
    if not encuesta or not encuesta.activa:
        raise Exception("Encuesta no activa o inexistente")
    if not (encuesta.fecha_inicio <= datetime.utcnow() <= encuesta.fecha_fin):
        raise Exception("Encuesta fuera de fecha")

    nueva = models.RespuestaEstudiante(
        estudiante_id=respuesta.estudiante_id,
        encuesta_id=respuesta.encuesta_id,
        respuesta_texto=respuesta.respuesta_texto,
        opcion_multiple=respuesta.opcion_multiple,
        progreso=50  
    )

    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva
