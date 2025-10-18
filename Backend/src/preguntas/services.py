from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.preguntas.models import Pregunta
from src.preguntas import schemas, exceptions
from src.opciones.models import Opcion
def crear_abierta(db: Session, pregunta: schemas.CrearPreguntaAbierta) -> Pregunta:
    _nueva_pregunta = Pregunta(
        texto=pregunta.texto, 
        tipo=pregunta.tipo.value,
        encuesta_id=pregunta.encuesta_id
    )

    db.add(_nueva_pregunta)
    db.commit()
    db.refresh(_nueva_pregunta)
    return _nueva_pregunta

def crear_cerrada(db: Session, pregunta: schemas.CrearPreguntaCerrada) -> Pregunta:

    opciones_validas = db.scalars(
        select(Opcion).where(Opcion.id.in_(pregunta.opciones))
    ).all()

    if len(opciones_validas) != len(pregunta.opciones):
        raise exceptions.PreguntaSinOpciones("Algunas opciones no existen")

    nueva_pregunta = Pregunta(
        texto=pregunta.texto, 
        tipo=pregunta.tipo.value,
        encuesta_id=pregunta.encuesta_id
    )
    nueva_pregunta.opciones = opciones_validas

    db.add(nueva_pregunta)
    db.commit()
    db.refresh(nueva_pregunta)
    return nueva_pregunta

def listar_preguntas(db: Session) -> List[schemas.Pregunta]:
    return db.scalars(select(Pregunta)).all()

def listar_opciones_pregunta(db: Session, pregunta_id: int) -> List[Opcion]:
    db_pregunta = recibir_pregunta(db, pregunta_id)
    return db_pregunta.opciones

def recibir_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta

def cambiar_pregunta(db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate) -> Pregunta:
    db_pregunta = recibir_pregunta(db, pregunta_id)
    
    for field, value in pregunta.model_dump(exclude_unset=True).items():
        setattr(db_pregunta, field, value)
    
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta

def actualizar_opciones_pregunta(db: Session, pregunta_id: int, opciones_ids: List[int]) -> Pregunta:
    db_pregunta = recibir_pregunta(db, pregunta_id)
    
    if db_pregunta.tipo != "cerrada":
        raise exceptions.OperacionNoPermitida("Solo preguntas cerradas pueden tener opciones")
    
    opciones_validas = db.scalars(
        select(Opcion).where(Opcion.id.in_(opciones_ids))
    ).all()
    
    if len(opciones_validas) != len(opciones_ids):
        raise exceptions.PreguntaSinOpciones("Algunas opciones no existen")
    
    db_pregunta.opciones = opciones_validas
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta

def eliminar_pregunta(db: Session, pregunta_id: int) -> schemas.PreguntaDelete:
    db_pregunta = recibir_pregunta(db, pregunta_id)
    db.delete(db_pregunta)
    db.commit()
    
    return schemas.PreguntaDelete(id=pregunta_id)