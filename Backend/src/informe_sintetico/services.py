from sqlalchemy.orm import Session
from . import models, schemas

def get_informes(db: Session):
    return db.query(models.InformeSintetico).all()

def get_informe(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()

def create_informe(db: Session, informe: schemas.InformeSinteticoCreate):
    db_informe = models.InformeSintetico(**informe.dict())
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe