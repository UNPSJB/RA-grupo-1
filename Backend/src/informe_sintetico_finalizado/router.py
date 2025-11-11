from fastapi import APIRouter, HTTPException, Depends,status, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.informe_sintetico_finalizado.models import InformeSinteticoFinalizado
from src.informe_sintetico_finalizado import schemas, services
from typing import List

router = APIRouter(prefix="/informes_sinteticos_finalizados", tags=["informes_sinteticos_finalizados"])

@router.post("/finalizados/", response_model=schemas.InformeSinteticoFinalizado, status_code=status.HTTP_201_CREATED)
def create_informe_finalizado(
    informe: schemas.InformeSinteticoFinalizadoCreate, 
    db: Session = Depends(get_db)
):
    try:
        return services.create_informe_finalizado(db, informe)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear informe finalizado: {str(e)}")
@router.get("/finalizados/")
def get_informes_finalizados(db: Session = Depends(get_db)):
    try:
        informes = db.query(InformeSinteticoFinalizado).all()
        return informes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener informes finalizados: {str(e)}")

@router.get("/finalizados/{id}")
def get_informe_finalizado(id: int, db: Session = Depends(get_db)):
    try:
        informe = db.query(InformeSinteticoFinalizado).filter(InformeSinteticoFinalizado.id == id).first()
        if not informe:
            raise HTTPException(status_code=404, detail="Informe finalizado no encontrado")
        return informe
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener informe finalizado: {str(e)}")

@router.get("/tabla_pregunta_2B/")
def get_tabla_pregunta_2B(id_dpto: int, id_carrera: int, anio: int, duracion: str, db: Session = Depends(get_db)):
    try:
        elementos = services.get_elementos_pregunta2B(db, id_dpto, id_carrera, anio, duracion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tabla de pregunta 2B: {str(e)}")