from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from src.informe_sintetico import models, schemas, exceptions
from typing import List

def get_informes(db: Session) -> List[schemas.InformeSinteticoBase]:
    stmt = (
        select(models.InformeSintetico)
        .options(
            selectinload(models.InformeSintetico.preguntas)
        )
    )
    return db.scalars(stmt).all()

def get_informe(db: Session, informe_id: int) -> schemas.InformeSinteticoBase:
    informe = db.scalar(select(models.InformeSintetico).where(models.InformeSintetico.id == informe_id).options(selectinload(models.InformeSintetico.preguntas)))
    if informe is None:
        raise exceptions.InformeNoEncontrado()
    return informe

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate) -> models.InformeSintetico:
    db_informe = models.InformeSintetico(**informe.model_dump())
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe