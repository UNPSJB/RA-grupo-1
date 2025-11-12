from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from src.informe_sintetico import schemas, services, exceptions
from src.pregunta_informe_sintetico import schemas as pregunta_schemas
from src.database import get_db
from typing import List
from src.informe_sintetico.models import InformeSintetico

router = APIRouter(prefix="/informes_sinteticos", tags=["informes_sinteticos"])

@router.post("/", response_model=schemas.InformeSintetico, status_code=status.HTTP_201_CREATED)
def crear_informe_sintetico_route(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)

@router.get("/", response_model=List[schemas.InformeSintetico])
def get_informes_sinteticos_route(db: Session = Depends(get_db)):
    return services.get_informes_sinteticos(db)

@router.get("/{informe_id}", response_model=schemas.InformeSintetico)
def get_informe_sintetico_route(informe_id: int, db: Session = Depends(get_db)):
    try:
        return services.get_informe_sintetico(db, informe_id)
    except exceptions.InformeSinteticoNoEncontrado:
        raise HTTPException(status_code=404, detail="Informe no encontrado")

@router.get("/{informe_id}/preguntas", response_model=List[pregunta_schemas.PreguntaInformeSintetico])
def get_preguntas_informe_sintetico_route(informe_id: int, db: Session = Depends(get_db)):
    try:
        return services.get_preguntas_informe_sintetico(db, informe_id)
    except exceptions.InformeSinteticoNoEncontrado:
        raise HTTPException(status_code=404, detail="Informe no encontrado")
    
@router.get("/")
def get_informes(carrera_id: int | None = None, db: Session = Depends(get_db)):
    try:
        query = db.query(InformeSintetico)
        if carrera_id is not None:
            query = query.filter(InformeSintetico.carrera_id == carrera_id)
        informes = query.all()
        return informes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener informes sintéticos: {str(e)}")


@router.post("/", response_model=schemas.InformeSintetico)
def create_informe(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    try:
        nuevo_informe = services.crear_informe_sintetico(db, informe)
        return nuevo_informe
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear informe sintético: {str(e)}")


# obtener un informe por ID
@router.get("/{id}")
def get_informe(id: int, db: Session = Depends(get_db)):
    try:
        informe = db.query(InformeSintetico).filter(InformeSintetico.id == id).first()
        if not informe:
            raise HTTPException(status_code=404, detail="Informe no encontrado")
        return informe
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener informe: {str(e)}")
