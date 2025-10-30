from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from src.encuesta_finalizada import schemas, models
from src.encuesta_finalizada import exceptions
from src.encuesta_finalizada.models import EncuestaFinalizada, EncuestaFinalizada
from src.respuestas import schemas as respuestas_schemas

def crear_encuesta_finalizada(db: Session, encuesta_data: schemas.EncuestaFinalizadaCreate) -> schemas.EncuestaFinalizada:
    encuesta_db = models.EncuestaFinalizada(**encuesta_data.model_dump())
    db.add(encuesta_db)
    db.commit()
    db.refresh(encuesta_db)
    return encuesta_db

def obtener_encuesta_finalizada(db: Session, encuesta_finalizada_id: int) -> schemas.EncuestaFinalizada:
    db_encuesta_finalizada = db.scalar(select(EncuestaFinalizada).where(EncuestaFinalizada.id == encuesta_finalizada_id))
    if db_encuesta_finalizada is None:
        raise exceptions.EncuestaFinalizadaNoEncontrada()
    return db_encuesta_finalizada

def obtener_encuestas_por_alumno(db: Session, alumno_id: int) -> List[schemas.EncuestaFinalizada]:  
    encuestas = db.scalars(
        select(models.EncuestaFinalizada)
        .where(models.EncuestaFinalizada.alumno_id == alumno_id) 
        .options(joinedload(models.EncuestaFinalizada.respuestas))
    ).unique().all()
    return encuestas


def crear_encuesta_finalizada_con_respuestas(db: Session, encuesta_data: schemas.EncuestaFinalizadaConRespuestasCreate):
    encuesta_db = models.EncuestaFinalizada(
        alumno_id=encuesta_data.alumno_id, 
        encuesta_id=encuesta_data.encuesta_id,
        asignatura_id=encuesta_data.asignatura_id,
        anio=encuesta_data.anio,
        duracion=encuesta_data.duracion
    )
    db.add(encuesta_db)
    db.commit()
    db.refresh(encuesta_db)
    
    from src.respuestas import services as respuestas_services
    respuestas_services.guardar_respuestas_lote(db, encuesta_db.id, encuesta_data.respuestas)
    
    return obtener_encuesta_finalizada(db, encuesta_db.id)

def verificar_encuesta_existente(db: Session, alumno_id: int, encuesta_id: int, asignatura_id: int, anio: int, duracion: str) -> bool:
    encuesta = db.scalar(
        select(EncuestaFinalizada)
        .where(EncuestaFinalizada.alumno_id == alumno_id)
        .where(EncuestaFinalizada.encuesta_id == encuesta_id)
        .where(EncuestaFinalizada.asignatura_id == asignatura_id)
        .where(EncuestaFinalizada.anio == anio)
        .where(EncuestaFinalizada.duracion == duracion)
    )
    return encuesta is not None