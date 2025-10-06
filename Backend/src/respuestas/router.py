from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.respuestas import services, schemas

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

@router.post("/", response_model=schemas.Respuesta)
def create_respuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_respuesta(db, respuesta)

@router.get("/", response_model=list[schemas.Respuesta])
def read_respuestas(db: Session = Depends(get_db)):
    return services.listar_respuestas(db)

@router.get("/{respuesta_id}", response_model=schemas.Respuesta)
def read_respuesta(respuesta_id: int, db: Session = Depends(get_db)):
    return services.leer_respuesta(db, respuesta_id)

@router.put("/{respuesta_id}", response_model=schemas.Respuesta)
def update_respuesta(
    respuesta_id: int, respuesta: schemas.RespuestaUpdate, db: Session = Depends(get_db)
):
    return services.modificar_respuesta(db, respuesta_id, respuesta)

@router.delete("/{respuesta_id}", response_model=dict)
def delete_respuesta(respuesta_id: int, db: Session = Depends(get_db)):
    return services.eliminar_respuesta(db, respuesta_id)
