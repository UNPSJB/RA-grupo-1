from sqlalchemy.orm import Session
from typing import List
from . import schemas
from .models import Departamento
from src.sedes.models import Sede


def crear_departamento(db: Session, departamento: schemas.DepartamentoBase) -> Departamento:
    nuevo = Departamento(
        nombre=departamento.nombre,
        sede_id=departamento.sede_id,
        profesor_a_cargo=departamento.profesor_a_cargo
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def listar_departamentos(db: Session) -> List[schemas.DepartamentoOut]:
    departamentos = db.query(Departamento).all()
    return departamentos


def leer_departamento(db: Session, departamento_id: int) -> schemas.DepartamentoOut:
    departamento = db.query(Departamento).filter(Departamento.id == departamento_id).first()
    return departamento


def eliminar_departamento(db: Session, departamento_id: int) -> bool:
    departamento = db.query(Departamento).filter(Departamento.id == departamento_id).first()
    if not departamento:
        return False

    db.delete(departamento)
    db.commit()
    return True
