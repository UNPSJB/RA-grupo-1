from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas import schemas, services

router = APIRouter(prefix="/encuestas", tags=["encuestas"])

@router.get("/", response_model=list[schemas.Encuesta])
def read_encuestas(db: Session = Depends(get_db)):
    return services.listar_encuestas(db)

#crear encuesta
@router.post("/",response_model=schemas.Encuesta)
def create_encuesta(encuesta: schemas.EncuestaCreate,  db: Session = Depends(get_db)):
    return services.crear_encuesta(db,encuesta)

@router.get("/{encuesta_id}", response_model=schemas.Encuesta)
def read_encuesta(encuesta_id: int, db:Session = Depends(get_db)):
     return services.leer_encuesta(db, encuesta_id)
 
@router.put("/{encuesta_id}", response_model=schemas.Encuesta)
def update_persona(
    encuesta_id: int, encuesta: schemas.EncuestaUpdate, db: Session = Depends(get_db)):
    return services.modificar_encuesta(db, encuesta_id, encuesta)


@router.delete("/{encuesta_id}", response_model=dict)
def delete_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    return services.eliminar_encuesta(db, encuesta_id)