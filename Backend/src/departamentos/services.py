from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.departamentos.models import Departamento
from src.departamentos import schemas, exceptions
from src.carreras.models import Carrera

def leer_departamento(db: Session, departamento_id: int) -> schemas.Departamento:
    db_departamento = db.scalar(
        select(Departamento).where(Departamento.id == departamento_id)
    )
    if db_departamento is None:
        raise exceptions.DepartamentoNoEncontrado()
    return db_departamento

def listar_departamentos(db: Session) -> List[schemas.Departamento]:
    return db.scalars(select(Departamento)).all()

def crear_departamento(db: Session, departamento: schemas.DepartamentoBase) -> schemas.Departamento:
    # Crea un nuevo departamento
    departamento_db = Departamento(**departamento.model_dump())
    db.add(departamento_db)
    db.commit()
    db.refresh(departamento_db)
    return departamento_db

def get_carreras_por_departamento(db: Session, departamento_id: int):
    stmt = (
        select(Carrera)
        .where(Carrera.departamento_id == departamento_id)
        .order_by(Carrera.nombre)
    )
    return db.scalars(stmt).all()