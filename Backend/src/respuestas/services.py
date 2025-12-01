from sqlalchemy.orm import Session
from sqlalchemy import select
from src.respuestas.models import Respuesta
from src.respuestas import schemas

def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> Respuesta:
    """
    Crea una nueva respuesta en la base de datos
    """
    db_respuesta = Respuesta(
        alumno_id=respuesta.alumno_id,
        pregunta_id=respuesta.pregunta_id,
        encuesta_finalizada_id=respuesta.encuesta_finalizada_id,
        ciclo_id=respuesta.ciclo_id,
        respuesta_texto=respuesta.respuesta_texto,
        opcion_id=respuesta.opcion_id
    )
    
    db.add(db_respuesta)
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta

def crear_respuestas_lote(db: Session, respuestas: list[schemas.RespuestaCreate]) -> list[Respuesta]:
    """
    Crea múltiples respuestas en lote
    """
    db_respuestas = []
    
    for respuesta in respuestas:
        db_respuesta = Respuesta(
            alumno_id=respuesta.alumno_id,
            pregunta_id=respuesta.pregunta_id,
            encuesta_finalizada_id=respuesta.encuesta_finalizada_id,
            ciclo_id=respuesta.ciclo_id,
            respuesta_texto=respuesta.respuesta_texto,
            opcion_id=respuesta.opcion_id
        )
        db_respuestas.append(db_respuesta)
    
    db.add_all(db_respuestas)
    db.commit()
    
    for db_respuesta in db_respuestas:
        db.refresh(db_respuesta)
    
    return db_respuestas

def listar_respuestas(db: Session, skip: int = 0, limit: int = 100) -> list[Respuesta]:
    """
    Lista todas las respuestas con paginación
    """
    return db.scalars(
        select(Respuesta).offset(skip).limit(limit)
    ).all()

def obtener_respuesta_por_id(db: Session, respuesta_id: int) -> Respuesta:
    """
    Obtiene una respuesta por su ID
    """
    respuesta = db.scalar(
        select(Respuesta).where(Respuesta.id == respuesta_id)
    )
    if not respuesta:
        raise ValueError(f"Respuesta con ID {respuesta_id} no encontrada")
    return respuesta

def obtener_respuestas_por_alumno(db: Session, alumno_id: int) -> list[Respuesta]:
    """
    Obtiene todas las respuestas de un alumno
    """
    return db.scalars(
        select(Respuesta).where(Respuesta.alumno_id == alumno_id)
    ).all()

def obtener_respuestas_por_pregunta(db: Session, pregunta_id: int) -> list[Respuesta]:
    """
    Obtiene todas las respuestas de una pregunta
    """
    return db.scalars(
        select(Respuesta).where(Respuesta.pregunta_id == pregunta_id)
    ).all()

def obtener_respuestas_por_encuesta_finalizada(db: Session, encuesta_finalizada_id: int) -> list[Respuesta]:
    """
    Obtiene todas las respuestas de una encuesta finalizada
    """
    return db.scalars(
        select(Respuesta).where(Respuesta.encuesta_finalizada_id == encuesta_finalizada_id)
    ).all()