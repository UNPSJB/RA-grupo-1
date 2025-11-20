from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informe_catedra_finalizado import schemas, services, models
from typing import List
from src.vinculaciones.models import Duracion

router = APIRouter(prefix="/informe-catedra-finalizado", tags=["informes-catedra-finalizados"])

@router.get("/docente/{docente_id}/pendientes", response_model=List[schemas.InformePendiente])
def listar_informes_pendientes(docente_id: int, anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.obtener_informes_pendientes(db, docente_id, anio, duracion)

@router.get("/docente/{docente_id}/finalizados", response_model=List[schemas.InformeCatedraFinalizado])
def listar_informes_finalizados_docentes(docente_id: int, db: Session = Depends(get_db)):
    return services.obtener_informes_finalizados_docente(db, docente_id)

@router.get("/existe")
def verificar_informe_catedra_finalizado(docente_asignatura_id: int, db: Session = Depends(get_db)):
    existe = services.verificar_informe_existente(db, docente_asignatura_id)
    return {"existe": existe}

@router.post("/", response_model=schemas.InformeCatedraFinalizado)
def crear_informe_catedra_finalizado(
    informe: schemas.InformeCatedraFinalizadoConRespuestasCreate, 
    db: Session = Depends(get_db) 
):
    return services.crear_informe_finalizado(db, informe)

@router.get("/{informe_id}", response_model=schemas.InformeCatedraFinalizadoDetalle)
def obtener_informe_catedra_finalizado(informe_id: int, db: Session = Depends(get_db)):
    return services.obtener_informe_finalizado_detalle(db, informe_id)

@router.get("/departamento/{departamento_id}", response_model=List[schemas.InformeCatedraFinalizado])
def obtener_informes_por_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.obtener_informes_por_departamento(db, departamento_id)