from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services

router = APIRouter(prefix="/respuestas", tags=["Respuestas"])

@router.post("/", response_model=schemas.RespuestaOut)
def crear_respuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    try:
        return services.crear_respuesta(db, respuesta)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
