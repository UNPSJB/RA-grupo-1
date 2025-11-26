from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db 
from . import services as filtros_services

router = APIRouter(prefix="/filtros",tags=["filtros-genericos"])

@router.get("/anios", response_model=List[int])
def get_anios(db: Session = Depends(get_db)):
    return filtros_services.get_anios_disponibles(db)


@router.get("/periodos", response_model=List[str])
def get_periodos(db: Session = Depends(get_db)):
    return filtros_services.get_periodos_disponibles(db)