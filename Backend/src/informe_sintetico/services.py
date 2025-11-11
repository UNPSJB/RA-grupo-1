from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from src.informe_sintetico import models, schemas, exceptions
from typing import List
from src.pregunta_informe_sintetico import schemas as pregunta_schemas

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate) -> models.InformeSintetico:
    db_informe = models.InformeSintetico(**informe.model_dump())
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe

def get_informe_sintetico(db: Session, informe_id: int) -> schemas.InformeSintetico:
    informe = db.scalar(select(models.InformeSintetico).where(models.InformeSintetico.id == informe_id)
                        .options(
                            selectinload(models.InformeSintetico.preguntas)
                        ))
    if informe is None:
        raise exceptions.InformeSinteticoBaseNoEncontrado()
    return informe

def get_informes_sinteticos(db: Session) -> List[schemas.InformeSintetico]:
    stmt = (
        select(models.InformeSintetico)
        .options(
            selectinload(models.InformeSintetico.preguntas)
        )
    )
    return db.scalars(stmt).all()

def get_preguntas_informe_sintetico(db: Session, informe_id: int) -> List [pregunta_schemas.PreguntaInformeSintetico]:
    informe = get_informe_sintetico(db, informe_id)
    return informe.preguntas
    

<<<<<<< HEAD
=======
def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate) -> models.InformeSintetico:
    db_informe = models.InformeSintetico(**informe.model_dump())
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe

create_informe = crear_informe_sintetico
>>>>>>> 36acc76b4cd641a710ecc46f4ba0eb0e155d4010
