from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.pregunta_informe_sintetico import schemas, services
from typing import List

router = APIRouter(prefix="/preguntas_sintetico", tags=["preguntas_informe_sintetico"])

@router.post("/{informe_base_id}", response_model=schemas.PreguntaInformeSintetico, status_code=status.HTTP_201_CREATED)
def create_pregunta_sintetico_route(
    informe_base_id: int, 
    pregunta: schemas.PreguntaInformeSinteticoCreate, 
    db: Session = Depends(get_db)
):
    return services.crear_pregunta_sintetico(db, pregunta, informe_base_id)

@router.get("/{pregunta_id}", response_model=schemas.PreguntaInformeSintetico)
def read_pregunta_sintetico_route(pregunta_id: int, db: Session = Depends(get_db)):
    try:
        return services.leer_pregunta_sintetico(db, pregunta_id)
    except services.exceptions.PreguntaInformeSinteticoNoEncontrada:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

@router.get("/base/{informe_base_id}", response_model=List[schemas.PreguntaInformeSintetico])
def read_preguntas_por_base_route(informe_base_id: int, db: Session = Depends(get_db)):
    return services.listar_preguntas_por_base(db, informe_base_id)