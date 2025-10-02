from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.asignaturas import schemas, services

router = APIRouter(prefix="/asignaturas", tags=["asignaturas"])

@router.get("/", response_model=list[schemas.Asignatura])
def read_asignatura(db: Session = Depends(get_db)):
    return services.listar_asignatura(db)

@router.get("/{asignatura_id}", response_model=schemas.Asignatura)
def read_asignatura(asignatura_id: int, db: Session = Depends(get_db)):
    asignatura = services.leer_asignatura(db, asignatura_id)
    return asignatura