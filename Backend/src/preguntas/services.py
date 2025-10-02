from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.pregunta.models import Pregunta, Opcion
from src.pregunta import schemas, exceptions
from src.opciones.models import Opcion

def crear_abierta(db: Session, pregunta: schemas.CrearPreguntaAbierta) -> Pregunta:
    _nueva_pregunta = Pregunta(texto=pregunta.texto, tipo="Abierta")

    db.add(_nueva_pregunta)
    db.commit()
    db.refresh(_nueva_pregunta)
    return _nueva_pregunta

def crear_cerrada(db: Session, pregunta: schemas.CrearPreguntaCerrada) -> Pregunta:
    if len(pregunta.opciones) == 0:
        raise exceptions.PreguntaSinOpciones()

    opciones_validas = db.query(Opcion).filter(Opcion.id.in_([op for op in pregunta.opciones if op > 0])).all()

    if len(opciones_validas) != len(pregunta.opciones):
        raise exceptions.PreguntaSinOpciones("Alguna de las opciones que brindaste no son las correctas.")
    
     nuevaPregunta = Pregunta(texto=pregunta.texto, tipo="Cerrada")
     nuevaPregunta.opciones = opciones_validas

     db.add(nuevaPregunta)
     db.commit()
     db.refresh(nuevaPregunta)
     return nuevaPregunta

def listar_preguntas(db: Session) -> List[schemas.Pregunta]:
    return db.scalars(select(Pregunta)).all()

def recibir_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta

def cambiar_pregunta(db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate) -> Pregunta:
    db_pregunta = recibir_pregunta(db, pregunta_id)
    db.execute(update(Pregunta).where(Pregunta.id == pregunta_id).values(**pregunta.model_dump()))
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta 

def eliminar_pregunta(db: Session, pregunta_id: int) -> schemas.PreguntaDelete:
    db_pregunta = recibir_pregunta(db, pregunta_id)
    db.execute(delete(Pregunta).where(Pregunta.id == pregunta_id))
    db.commit()
    return db_pregunta