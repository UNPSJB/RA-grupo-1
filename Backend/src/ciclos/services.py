from sqlalchemy.orm import Session
from . import models, schemas
from src.encuestas.models import Encuesta
from typing import List

def create_ciclo(db: Session, ciclo: schemas.CicloCreate):
    db_ciclo = models.CicloEncuesta(**ciclo.dict())
    db.add(db_ciclo)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo

def get_ciclos(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.CicloEncuesta).offset(skip).limit(limit).all()

def get_ciclo(db: Session, ciclo_id: int):
    return db.query(models.CicloEncuesta).filter(models.CicloEncuesta.id == ciclo_id).first()

def update_ciclo(db: Session, ciclo_id: int, ciclo: schemas.CicloUpdate):
    db_ciclo = get_ciclo(db, ciclo_id)
    if not db_ciclo:
        return None
    for key, value in ciclo.dict(exclude_unset=True).items():
        setattr(db_ciclo, key, value)
    db.commit()
    db.refresh(db_ciclo)
    return db_ciclo

def delete_ciclo(db: Session, ciclo_id: int):
    db_ciclo = get_ciclo(db, ciclo_id)
    if not db_ciclo:
        return None
    db.delete(db_ciclo)
    db.commit()
    return db_ciclo

def asignar_encuestas(db: Session, ciclo_id: int, encuestas_ids: List[int]):
    ciclo = db.query(models.CicloEncuesta).filter(models.CicloEncuesta.id == ciclo_id).first()
    if not ciclo:
        return None

    # limpiar asignaciones viejas
    db.query(Encuesta).filter(Encuesta.ciclo_id == ciclo_id).update({Encuesta.ciclo_id: None})

    # asignar nuevas
    db.query(Encuesta).filter(Encuesta.id.in_(encuestas_ids)).update(
        {Encuesta.ciclo_id: ciclo_id},
        synchronize_session=False
    )

    db.commit()
    return {"ok": True, "message": "Encuestas asignadas al ciclo"}

def obtener_encuestas_asignadas(db: Session, ciclo_id: int):
    encuestas = db.query(Encuesta.id).filter(Encuesta.ciclo_id == ciclo_id).all()
    return [e.id for e in encuestas]