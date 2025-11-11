from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.carreras import schemas, services

router = APIRouter(prefix="/carreras", tags=["carreras"])

@router.get("/", response_model=list[schemas.Carrera])
def leer_carreras(db: Session = Depends(get_db)):
    return services.listar_carreras(db)

@router.get("/{carrera_id}", response_model=schemas.Carrera)
def leer_carrera(carrera_id: int, db: Session = Depends(get_db)):
    return services.leer_carrera(db, carrera_id)

@router.get("/departamento/{departamento_id}", response_model=list[schemas.Carrera])
def leer_carreras_por_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.listar_carreras_por_departamento(db, departamento_id)

@router.get("/departamento/{departamento_id}/informes_pendientes", response_model=list[schemas.Carrera])
def informes_pendientes(departamento_id: int, db: Session = Depends(get_db)):
    return services.informes_sinteticos_pendientes(db, departamento_id)