from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informe_sintetico import schemas, services
from src.informe_sintetico.models import InformeSintetico

router = APIRouter(prefix="/informes", tags=["informes"])


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
