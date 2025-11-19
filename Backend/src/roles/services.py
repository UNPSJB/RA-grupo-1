from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.roles.models import Rol
from src.roles import schemas

def listar_roles(db: Session) -> List[schemas.Rol]:
    roles = db.scalars(select(Rol)).all()
    return roles

def leer_rol(db: Session, rol_id: int) -> schemas.Rol:
    rol = db.scalar(select(Rol).where(Rol.id == rol_id))
    if not rol:
        raise ValueError(f"Rol con ID {rol_id} no encontrado")
    return rol