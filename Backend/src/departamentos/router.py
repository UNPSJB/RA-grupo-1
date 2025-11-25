from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session 
from src.database import get_db
from src.departamentos import schemas, services

router = APIRouter(prefix="/departamentos", tags=["departamentos"])

@router.get("/", response_model=list[schemas.Departamento])
def leer_departamentos(db: Session = Depends(get_db)):
    return services.listar_departamentos(db)

@router.post("/", response_model=schemas.Departamento)
def crear_departamento(dep: schemas.DepartamentoBase, db: Session = Depends(get_db)):
    return services.crear_departamento(db, dep)

@router.get("/{departamento_id}", response_model=schemas.Departamento)
def leer_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.leer_departamento(db, departamento_id)

@router.post("/", response_model=schemas.Departamento)
def create_departamento(departamento: schemas.DepartamentoBase, db: Session = Depends(get_db)):
    return services.crear_departamento(db, departamento)