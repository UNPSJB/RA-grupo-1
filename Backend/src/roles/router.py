from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.roles import schemas, services

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("/", response_model=list[schemas.Rol])
def read_roles(db: Session = Depends(get_db)):
    return services.listar_roles(db)

@router.get("/{rol_id}", response_model= schemas.Rol)
def read_rol(rol_id: int , db: Session = Depends(get_db)):
    return services.leer_rol(db, rol_id)