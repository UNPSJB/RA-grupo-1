from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.roles.models import Rol
from src.roles import schemas

def listar_roles(db: Session) -> List[schemas.Rol]:
    roles = db.scalars(select(Rol)).all()
    return [schemas.Rol.from_orm(rol) for rol in roles]

def leer_rol(db: Session, rol_id: int) -> Optional[schemas.Rol]:
    rol = db.scalar(select(Rol).where(Rol.id == rol_id))
    if rol:
        return schemas.Rol.from_orm(rol)
    return None