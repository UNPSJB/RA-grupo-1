from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.resultado_informe import schemas, services

router = APIRouter(prefix="/resultado-informe", tags=["resultado-informe"])

@router.post("/lote", response_model=list[schemas.RespuestaInforme])
def crear_respuestas_informe_lote(
    respuestas: list[schemas.RespuestaInformeCreate], 
    db: Session = Depends(get_db)
):
    return services.guardar_respuestas_lote(db, respuestas)

@router.post("/", response_model=schemas.RespuestaInforme)
def crear_respuesta_informe(
    respuesta: schemas.RespuestaInformeCreate,  
    db: Session = Depends(get_db)
):
    return services.guardar_respuesta(db, respuesta)