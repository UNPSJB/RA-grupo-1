from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informes import schemas, services

router = APIRouter(prefix="/informes", tags=["informes"])

@router.get("/", response_model=list[schemas.Informe])
def read_informes(db: Session = Depends(get_db)):
    return services.listar_informes(db)

@router.post("/", response_model=schemas.Informe)
def create_informe(informe: schemas.InformeCreate, db: Session = Depends(get_db)):
    return services.crear_informe(db, informe)

@router.get("/{informe_id}", response_model=schemas.Informe)
def read_informe(informe_id: int, db:Session = Depends(get_db)):
    return services.leer_informe(db, informe_id)