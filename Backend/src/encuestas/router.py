from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services

router = APIRouter(prefix="/encuestas", tags=["Encuestas"])

@router.post("/", response_model=schemas.EncuestaResponse)
def crear_encuesta(encuesta: schemas.EncuestaCreate, db: Session = Depends(get_db)):
    return services.crear_encuesta(db, encuesta)

@router.post("/responder", response_model=schemas.RespuestaResponse)
def responder_encuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    try:
        return services.responder_encuesta(db, respuesta)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
