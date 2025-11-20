from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session 
from src.database import get_db
from src.departamentos import schemas, services

router = APIRouter(prefix="/departamentos", tags=["departamentos"])

@router.get("/", response_model=list[schemas.Departamento])
def leer_departamentos(db: Session = Depends(get_db)):
    return services.listar_departamentos(db)

@router.get("/{departamento_id}", response_model=schemas.Departamento)
def leer_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.leer_departamento(db, departamento_id)