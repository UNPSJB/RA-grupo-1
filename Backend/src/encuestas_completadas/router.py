from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas_completadas import schemas, services
from typing import List
from src.vinculaciones.models import Duracion

router = APIRouter(prefix="/encuesta-completada", tags=["encuestas-completadas"])

@router.get("/existe")
def verificar_encuesta_completada(alumno_id: int, encuesta_id: int, asignatura_id: int, anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    existe = services.verificar_encuesta_existente(db, alumno_id, encuesta_id, asignatura_id, anio, duracion)
    return {"existe": existe}

@router.post("/", response_model=schemas.EncuestaCompletada)
def crear_encuesta_completada(encuesta: schemas.EncuestaCompletadaCreate, db: Session = Depends(get_db)):
    return services.crear_encuesta_completada(db, encuesta)

@router.post("/con-respuestas", response_model=schemas.EncuestaCompletada)
def crear_encuesta_completa_con_respuestas(encuesta_data: schemas.EncuestaCompletadaConRespuestasCreate, db: Session = Depends(get_db)):
    return services.crear_encuesta_completa_con_respuestas(db, encuesta_data)

@router.get("/{encuesta_id}", response_model=schemas.EncuestaCompletada)
def obtener_encuesta_completada(encuesta_id: int, db: Session = Depends(get_db)):
    return services.obtener_encuesta_completada(db, encuesta_id)

@router.get("/alumno/{alumno_id}", response_model=List[schemas.EncuestaCompletada])
def obtener_encuestas_por_alumno(alumno_id: int, db: Session = Depends(get_db)):
    return services.obtener_encuestas_por_alumno(db, alumno_id)