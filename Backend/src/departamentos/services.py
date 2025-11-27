from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.departamentos.models import Departamento
from src.departamentos.schemas import DepartamentoBase
from src.carreras.models import Carrera
import src.departamentos.exceptions as exceptions


def leer_departamento(db: Session, departamento_id: int):
    departamento = db.scalar(
        select(Departamento).where(Departamento.id == departamento_id)
    )
    if departamento is None:
        raise exceptions.DepartamentoNoEncontrado()
    return departamento


def listar_departamentos(db: Session):
    return db.scalars(select(Departamento)).all()


def crear_departamento(db: Session, departamento: DepartamentoBase):
    nuevo = Departamento(**departamento.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def get_carreras_por_departamento(db: Session, departamento_id: int):
    stmt = (
        select(Carrera)
        .where(Carrera.departamento_id == departamento_id)
        .order_by(Carrera.nombre)
    )
    return db.scalars(stmt).all()
