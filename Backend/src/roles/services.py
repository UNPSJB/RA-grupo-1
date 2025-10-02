from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.roles.models import Rol
from src.roles import schemas

def listar_roles(db: Session) -> List[schemas.Rol]:
    return db.scalars(select(Rol)).all()

def leer_rol(db: Session, rol_id: int) -> schemas.Rol:
    return db.scalar(select(Rol).where(Rol.id == rol_id))