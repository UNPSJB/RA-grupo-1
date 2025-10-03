from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.docentes import schemas, services
from src.docentes import services as docente_services

router = APIRouter(prefix="/docentes", tags=["docentes"])

@router.get("/", response_model=List[schemas.Docente])
def read_docentes(db: Session = Depends(get_db)):
    return services.listar_docentes(db)

@router.get("/{docente_id}", response_model=schemas.Docente)
def read_docente(docente_id: int, db: Session = Depends(get_db)):
    docente = services.leer_docente(db, docente_id)
    return docente