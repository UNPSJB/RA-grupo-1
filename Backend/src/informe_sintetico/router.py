from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informe_sintetico.models import InformeSintetico

router = APIRouter(prefix="/informes", tags=["informes"])

@router.get("/")
def get_informes(db: Session = Depends(get_db)):
    try:
        informes = db.query(InformeSintetico).all()
        return informes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener informes sinteticos: {str(e)}")

@router.get("/{id}")
def get_informe(id: int, db: Session = Depends(get_db)):
    try:
        informe = db.query(InformeSintetico).filter(InformeSintetico.id == id).first()
        if not informe:
            raise HTTPException(status_code=404, detail="Informe no encontrado")
        return informe
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener informe: {str(e)}")