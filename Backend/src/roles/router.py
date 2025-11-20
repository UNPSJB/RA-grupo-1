from fastapi import APIRouter, Depends,HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.roles import schemas, services

router = APIRouter(prefix="/roles", tags=["roles"])

@router.post("/", response_model=schemas.Rol)
def create_rol(rol: schemas.RolCreate, db: Session = Depends(get_db)):
    return services.crear_rol(db, rol)

@router.get("/", response_model=list[schemas.Rol])
def read_roles(db: Session = Depends(get_db)):
    return services.listar_roles(db)

@router.get("/{rol_id}", response_model=schemas.Rol)
def read_rol(rol_id: int, db: Session = Depends(get_db)):
    try:
        return services.leer_rol(db, rol_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))