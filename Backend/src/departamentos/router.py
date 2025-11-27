from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.departamentos import schemas, services

router = APIRouter(prefix="/departamentos", tags=["Departamentos"])

# LISTAR TODOS LOS DEPARTAMENTOS (con sede incluida)
@router.get("/", response_model=List[schemas.DepartamentoOut])
def listar_departamentos(db: Session = Depends(get_db)):
    return services.listar_departamentos(db)

# OBTENER UN DEPARTAMENTO POR ID (con sede incluida)
@router.get("/{departamento_id}", response_model=schemas.DepartamentoOut)
def leer_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.leer_departamento(db, departamento_id)

# CREAR DEPARTAMENTO
@router.post("/", response_model=schemas.DepartamentoOut)
def crear_departamento(departamento: schemas.DepartamentoBase, db: Session = Depends(get_db)):
    return services.crear_departamento(db, departamento)

# OBTENER CARRERAS DE UN DEPARTAMENTO
@router.get("/{departamento_id}/carreras")
def carreras_por_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.get_carreras_por_departamento(db, departamento_id)
