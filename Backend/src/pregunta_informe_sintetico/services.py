from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.pregunta_informe_sintetico import models, schemas, exceptions
from src.informe_sintetico.models import InformeSintetico

def crear_pregunta_sintetico(db: Session, pregunta: schemas.PreguntaInformeSinteticoCreate, informe_base_id: int):
    # Validar que el informe base existe
    informe = db.scalar(select(InformeSintetico).where(InformeSintetico.id == informe_base_id))
    if informe is None:
        raise exceptions.PreguntaInformeSinteticoNoEncontrada()

    db_pregunta = models.PreguntaInformeSintetico(
        **pregunta.model_dump(),
        informe_base_id=informe_base_id
    )
    db.add(db_pregunta)
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta

def leer_pregunta_sintetico(db: Session, pregunta_id: int) -> models.PreguntaInformeSintetico:
    db_pregunta = db.scalar(select(models.PreguntaInformeSintetico).where(models.PreguntaInformeSintetico.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaInformeSinteticoNoEncontrada()
    return db_pregunta

def listar_preguntas_por_base(db: Session, informe_base_id: int) -> List[models.PreguntaInformeSintetico]:
    return db.scalars(
        select(models.PreguntaInformeSintetico)
        .where(models.PreguntaInformeSintetico.informe_base_id == informe_base_id)
        .order_by(models.PreguntaInformeSintetico.orden)
    ).all()