from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuesta_finalizada import schemas, services
from typing import List
from src.vinculaciones.models import Duracion

router = APIRouter(prefix="/encuesta-finalizada", tags=["encuestas-finalizadas"])

@router.get("/existe")
def verificar_encuesta_finalizada(alumno_id: int, encuesta_id: int, asignatura_id: int, anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    existe = services.verificar_encuesta_existente(db, alumno_id, encuesta_id, asignatura_id, anio, duracion)
    return {"existe": existe}

@router.post("/", response_model=schemas.EncuestaFinalizada)
def crear_encuesta_finalizada(encuesta: schemas.EncuestaFinalizadaCreate, db: Session = Depends(get_db)):
    return services.crear_encuesta_finalizada(db, encuesta)

@router.post("/con-respuestas", response_model=schemas.EncuestaFinalizada)
def crear_encuesta_finalizada_con_respuestas(encuesta_data: schemas.EncuestaFinalizadaConRespuestasCreate, db: Session = Depends(get_db)):
    return services.crear_encuesta_finalizada_con_respuestas(db, encuesta_data)

@router.get("/{encuesta_id}", response_model=schemas.EncuestaFinalizada)
def obtener_encuesta_finalizada(encuesta_id: int, db: Session = Depends(get_db)):
    return services.obtener_encuesta_finalizada(db, encuesta_id)

@router.get("/alumno/{alumno_id}", response_model=List[schemas.EncuestaFinalizada])
def obtener_encuestas_por_alumno(alumno_id: int, db: Session = Depends(get_db)):
    return services.obtener_encuestas_por_alumno(db, alumno_id)