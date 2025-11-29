from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.periodos_apertura import schemas, services
from src.vinculaciones.models import Duracion  
#from src.users import schemas as user_schemas
#from src.auth.dependencies import tiene_rol_secretaria

router = APIRouter(prefix="/periodos_apertura", tags=["periodos_apertura"])

# Rutas para periodos de apertura

#@router.post("/", response_model=schemas.PeriodoApertura)
#def create_periodo_apertura(apertura: schemas.PeriodoAperturaCreate, db: Session = Depends(get_db), user: user_schemas.User = Depends(tiene_rol_secretaria)):
#    return services.crear_periodo_apertura(db, apertura)

@router.get("/", response_model= schemas.PeriodoApertura)
def read_periodo_apertura(anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.leer_periodo_apertura(db, anio, duracion)

@router.get("/fechas_encuesta", response_model= schemas.PeriodoEncuesta)
def read_periodo_encuestas(anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.leer_fechas_encuesta(db, anio, duracion)

@router.get("/fechas_informe_catedra", response_model= schemas.PeriodoInformeCatedra)
def read_periodo_informe_catedra(anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.leer_fechas_informe_catedra(db, anio, duracion)

@router.get("/fechas_informe_sintetico", response_model= schemas.PeriodoInformeSintetico)
def read_periodo_informe_sintetico(anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.leer_fechas_informe_sintetico(db, anio, duracion)