from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from src.database import get_db
from src.informe_sintetico import schemas, services, exceptions
from src.pregunta_informe_sintetico import schemas as pregunta_schemas
from src.informe_sintetico.models import InformeSintetico

router = APIRouter(prefix="/informes_sinteticos", tags=["Informes Sintéticos"])

@router.post("/", response_model=schemas.InformeSintetico)
def crear_informe(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)


@router.get("/", response_model=List[schemas.InformeSintetico])
def listar_informes(carrera_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(InformeSintetico)
    if carrera_id:
        query = query.filter(InformeSintetico.carrera_id == carrera_id)
    return query.all()

@router.get("/{informe_id}", response_model=schemas.InformeSintetico)
def obtener_informe(informe_id: int, db: Session = Depends(get_db)):
    try:
        return services.get_informe_sintetico(db, informe_id)
    except exceptions.InformeSinteticoNoEncontrado:
        raise HTTPException(status_code=404, detail="Informe no encontrado")

@router.get("/{informe_id}/preguntas", response_model=List[pregunta_schemas.PreguntaInformeSintetico])
def preguntas_de_informe(informe_id: int, db: Session = Depends(get_db)):
    return services.get_preguntas_informe_sintetico(db, informe_id)
