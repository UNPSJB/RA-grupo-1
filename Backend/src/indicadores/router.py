from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.indicadores import services, schemas
from typing import List
from src.vinculaciones.models import Duracion

router = APIRouter(prefix="/indicadores", tags=["indicadores"])

@router.get("/", response_model=List[schemas.IndicadoresCategoria])
def get_indicadores(id_asignatura: int, anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.obtener_indicadores(db, id_asignatura, anio, duracion) 

@router.post("/guardar_indicadores/{informe_id}")
def create_guardar_indicadores(informe_id: int, db: Session = Depends(get_db)):
    services.guardar_indicadores(db, informe_id)
    return {"message": "Indicadores generados y guardados correctamente."}

@router.get("/recuperar_existentes/{informe_id}", response_model=List[schemas.IndicadoresPregunta])
def get_indicadores_existentes(informe_id: int, db: Session = Depends(get_db)):
    return services.recuperar_indicadores(db, informe_id)  

@router.get("/cantidad_encuestas_finalizadas", response_model=int)
def get_cantidad_encuestas_finalizadas(id_asignatura: int, anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.cantidad_encuestas_finalizadas(db, id_asignatura, anio, duracion)

@router.get("/respuestas_abiertas", response_model=List[schemas.IndicadoresAbiertosCategoria])
def obtener_respuestas_abiertas(
    id_asignatura: int,
    anio: int,
    duracion: Duracion,
    db: Session = Depends(get_db)
):
    return services.obtener_respuestas_abiertas_por_asignatura(db, id_asignatura, anio, duracion)