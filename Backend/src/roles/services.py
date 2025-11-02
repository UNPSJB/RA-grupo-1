from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.roles.models import Rol
from src.roles import schemas
from datetime import date

def crear_rol(db: Session, rol: schemas.RolCreate) -> schemas.Rol:
    # Si no se proporciona fecha_creacion, usa la fecha actual
    rol_data = rol.model_dump()
    if rol_data.get('fecha_creacion') is None:
        rol_data['fecha_creacion'] = date.today()
    
    _rol = Rol(**rol_data)
    db.add(_rol)
    db.commit()
    db.refresh(_rol)
    return _rol  

def listar_roles(db: Session) -> List[schemas.Rol]:
    roles = db.scalars(select(Rol)).all()
    return roles

def leer_rol(db: Session, rol_id: int) -> schemas.Rol:
    rol = db.scalar(select(Rol).where(Rol.id == rol_id))
    if not rol:
        raise ValueError(f"Rol con ID {rol_id} no encontrado")
    return rol