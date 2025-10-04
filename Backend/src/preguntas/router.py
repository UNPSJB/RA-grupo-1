from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from src.preguntas import services, schemas
router = APIRouter(prefix="/preguntas", tags=["preguntas"]) 

@router.post("/cerrada")
def pregunta_cerrada(pregunta: schemas.PreguntaCerradaCreate, db: Session = Depends(get_db)):
    return services.pregunta_cerrada(db, pregunta)

@router.post("/abierta", response_model=schemas.Pregunta) 
def pregunta_abierta(pregunta: schemas.PreguntaAbiertaCreate, db: Session = Depends(get_db)):
    return services.pregunta_abierta(db, pregunta)

@router.get("/", response_model=list[schemas.Pregunta])
def leer_pregunta(db: Session = Depends(get_db)) -> list[schemas.Pregunta]:
    return services.listar_preguntas(db)

@router.get("/{pregunta_id}", response_model=schemas.Pregunta)
def leer_pregunta(pregunta_id: int, db: Session = Depends(get_db)) -> schemas.Pregunta:
    return services.recibir_pregunta(db, pregunta_id) 

@router.put("/{pregunta_id}", response_model=schemas.Pregunta)
def renovar_pregunta(pregunta_id: int, pregunta: schemas.PreguntaUpdate, db: Session = Depends(get_db)) -> schemas.Pregunta:
    return services.cambiar_pregunta(db, pregunta_id, pregunta)

@router.delete("/{pregunta_id}", response_model=schemas.PreguntaDelete)
def borrar_pregunta(pregunta_id: int, db: Session = Depends(get_db)) -> schemas.PreguntaDelete:
    return services.eliminar_pregunta(db, pregunta_id)  