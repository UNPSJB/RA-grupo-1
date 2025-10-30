from sqlalchemy.orm import Session
from . import models, schemas

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