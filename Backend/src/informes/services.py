from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.informes.models import Informe
from src.informes import schemas, exceptions
from typing import List

def listar_informes(db:Session) -> List[schemas.Informe]:
    return db.scalars(select(Informe)).all()

def crear_informe(db: Session, informe: schemas.InformeCreate) -> schemas.Informe:
    _informe = Informe(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return _informe

def leer_informe(db: Session, informe_id: int)-> schemas.Informe:
    db_informe = db.scalar(select(Informe).where(Informe.id == informe_id))
    if db_informe is None:
        raise exceptions.InformeNoEncontrado()
    return db_informe