from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, delete, update
from datetime import datetime
from . import models, schemas
from src.encuestas.models import Encuesta
from src.preguntas.models import Pregunta
from src.alumnos.models import Alumno
from .exceptions import (
    EncuestaNoEncontrada,
    EncuestaNoActiva,
    EncuestaFueraDeFecha,
    PreguntaNoEncontrada,
    AlumnoNoEncontrado,
    RespuestaInvalida,
    RespuestaNoEncontrada
)

def _validar_encuesta(db: Session, encuesta_id: int) -> Encuesta:
    # Valida que la encuesta exista, esté activa y en fecha
    encuesta = db.scalar(select(Encuesta).where(Encuesta.id == encuesta_id))
    if not encuesta:
        raise EncuestaNoEncontrada(f"Encuesta con ID {encuesta_id} no encontrada")
    if not encuesta.activa:
        raise EncuestaNoActiva(f"Encuesta con ID {encuesta_id} no está activa")
    if not (encuesta.fecha_inicio <= datetime.utcnow() <= encuesta.fecha_fin):
        raise EncuestaFueraDeFecha("La encuesta está fuera de fecha válida")
    return encuesta

def _validar_pregunta(db: Session, pregunta_id: int) -> Pregunta:
    # Valida que la pregunta exista
    pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if not pregunta:
        raise PreguntaNoEncontrada(f"Pregunta con ID {pregunta_id} no encontrada")
    return pregunta

def _validar_alumno(db: Session, alumno_id: int) -> Alumno:
    # Valida que el alumno exista
    alumno = db.scalar(select(Alumno).where(Alumno.id == alumno_id))
    if not alumno:
        raise AlumnoNoEncontrado(f"Alumno con ID {alumno_id} no encontrado")
    return alumno

def _validar_tipo_respuesta(pregunta: Pregunta, respuesta_data: schemas.RespuestaCreate):
    # Valida que el tipo de respuesta coincida con el tipo de pregunta
    if pregunta.tipo == "texto" and not respuesta_data.respuesta_texto:
        raise RespuestaInvalida("La pregunta es de texto, se requiere 'respuesta_texto'")
    if pregunta.tipo == "opcion_multiple" and not respuesta_data.opcion_id:
        raise RespuestaInvalida("La pregunta es de opción múltiple, se requiere 'opcion_id'")

def _crear_respuesta_db(respuesta_data: schemas.RespuestaCreate) -> models.Respuesta:
    # Crea una instancia de modelo Respuesta a partir de schema
    return models.Respuesta(
        alumno_id=respuesta_data.alumno_id,
        pregunta_id=respuesta_data.pregunta_id,
        respuesta_texto=respuesta_data.respuesta_texto,
        opcion_id=respuesta_data.opcion_id,
        progreso=respuesta_data.progreso or 50
    )

def crear_respuesta(db: Session, respuesta_data: schemas.RespuestaCreate) -> schemas.RespuestaOut:
    # Crea una nueva respuesta con validaciones completas
    _validar_alumno(db, respuesta_data.alumno_id)
    pregunta = _validar_pregunta(db, respuesta_data.pregunta_id)
    _validar_tipo_respuesta(pregunta, respuesta_data)
    
    # Si la pregunta pertenece a una encuesta, valida la encuesta
    if pregunta.encuesta_id:
        _validar_encuesta(db, pregunta.encuesta_id)

    # Crea respuesta
    db_respuesta = _crear_respuesta_db(respuesta_data)
    
    db.add(db_respuesta)
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta

def crear_respuestas_lote(db: Session, respuestas_data: List[schemas.RespuestaCreate]) -> List[schemas.RespuestaOut]:
    
    # Crea múltiples respuestas en una sola transacción
    respuestas_db = []
    
    for respuesta_data in respuestas_data:
        # Validaciones individuales
        _validar_alumno(db, respuesta_data.alumno_id)
        pregunta = _validar_pregunta(db, respuesta_data.pregunta_id)
        _validar_tipo_respuesta(pregunta, respuesta_data)
        
        if pregunta.encuesta_id:
            _validar_encuesta(db, pregunta.encuesta_id)
        
        db_respuesta = _crear_respuesta_db(respuesta_data)
        db.add(db_respuesta)
        respuestas_db.append(db_respuesta)
    
    db.commit()
    
    # Refresca todas las respuestas
    for respuesta in respuestas_db:
        db.refresh(respuesta)
    
    return respuestas_db

def obtener_respuesta_por_id(db: Session, respuesta_id: int) -> schemas.RespuestaOut:
    
    # Obtiene una respuesta por su ID
    respuesta = db.scalar(select(models.Respuesta).where(models.Respuesta.id == respuesta_id))
    if not respuesta:
        raise RespuestaNoEncontrada(f"Respuesta con ID {respuesta_id} no encontrada")
    return respuesta

def obtener_respuestas_por_alumno(db: Session, alumno_id: int) -> List[schemas.RespuestaOut]:

    # Obtiene todas las respuestas de un alumno específico
    
    _validar_alumno(db, alumno_id)  # Valida que el alumno existe
    return db.scalars(
        select(models.Respuesta)
        .where(models.Respuesta.alumno_id == alumno_id)
    ).all()

def obtener_respuestas_por_pregunta(db: Session, pregunta_id: int) -> List[schemas.RespuestaOut]:

    # Obtiene todas las respuestas de una pregunta específica
    _validar_pregunta(db, pregunta_id)  # Valida que la pregunta existe
    return db.scalars(
        select(models.Respuesta)
        .where(models.Respuesta.pregunta_id == pregunta_id)
    ).all()

def listar_respuestas(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.RespuestaOut]:

    # Lista todas las respuestas con paginación    
    return db.scalars(
        select(models.Respuesta)
        .offset(skip)
        .limit(limit)
    ).all()

def actualizar_respuesta(
    db: Session, 
    respuesta_id: int, 
    respuesta_update: schemas.RespuestaUpdate
) -> schemas.RespuestaOut:
    
    # ctualiza una respuesta existente
    respuesta_existente = obtener_respuesta_por_id(db, respuesta_id)
    
    # Valida tipo de respuesta si se están actualizando campos relacionados
    if respuesta_update.respuesta_texto is not None or respuesta_update.opcion_id is not None:
        pregunta = _validar_pregunta(db, respuesta_existente.pregunta_id)
        _validar_tipo_respuesta(pregunta, schemas.RespuestaCreate(
            alumno_id=respuesta_existente.alumno_id,
            pregunta_id=respuesta_existente.pregunta_id,
            respuesta_texto=respuesta_update.respuesta_texto or respuesta_existente.respuesta_texto,
            opcion_id=respuesta_update.opcion_id or respuesta_existente.opcion_id,
            progreso=respuesta_update.progreso or respuesta_existente.progreso
        ))

    # Actualiza
    update_data = respuesta_update.model_dump(exclude_unset=True)
    db.execute(
        update(models.Respuesta)
        .where(models.Respuesta.id == respuesta_id)
        .values(**update_data)
    )
    db.commit()
    db.refresh(respuesta_existente)
    
    return respuesta_existente

def eliminar_respuesta(db: Session, respuesta_id: int) -> schemas.RespuestaOut:
    
    # Elimina una respuesta
    respuesta = obtener_respuesta_por_id(db, respuesta_id)
    db.execute(delete(models.Respuesta).where(models.Respuesta.id == respuesta_id))
    db.commit()
    return respuesta