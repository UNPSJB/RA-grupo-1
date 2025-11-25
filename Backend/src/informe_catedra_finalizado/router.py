from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informe_catedra_finalizado import schemas, services, models
from typing import List
from src.vinculaciones.models import Duracion

router = APIRouter(prefix="/informe-catedra-finalizado", tags=["informe-catedra-finalizados"])

@router.get("/docente/{docente_id}/pendientes", response_model=List[schemas.InformeCatedraFinalizadoDetalle])
def listar_informes_pendientes(docente_id: int, anio: int, duracion: Duracion, db: Session = Depends(get_db)):
    return services.obtener_informes_pendientes(db, docente_id, anio, duracion)

@router.get("/docente/{docente_id}/finalizados", response_model=List[schemas.InformeCatedraFinalizadoDetalle])
def listar_informes_finalizados_docentes(docente_id: int, db: Session = Depends(get_db)):
    return services.obtener_informes_finalizados_docente(db, docente_id)

@router.get("/existe")
def verificar_informe_catedra_finalizado(docente_asignatura_id: int, db: Session = Depends(get_db)):
    existe = services.verificar_informe_existente(db, docente_asignatura_id)
    return {"existe": existe}

@router.post("/", response_model=schemas.InformeCatedraFinalizado)
def crear_informe_catedra_finalizado(
    informe: schemas.InformeCatedraFinalizadoCreate, 
    db: Session = Depends(get_db) 
):
    return services.crear_informe_finalizado(db, informe)

@router.get("/{informe_id}", response_model=schemas.InformeCatedraFinalizadoDetalle)
def obtener_informe_catedra_finalizado(informe_id: int, db: Session = Depends(get_db)):
    return services.obtener_informe_finalizado(db, informe_id)

@router.get("/departamento/{departamento_id}", response_model=List[schemas.InformeCatedraFinalizado])
def obtener_informes_por_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.obtener_informes_por_departamento(db, departamento_id)

@router.put("/{informe_id}", response_model=schemas.InformeCatedraFinalizadoDetalle)
def actualizar_informe_catedra_finalizado(informe_id: int, data: schemas.InformeCatedraFinalizadoUpdate, db: Session = Depends(get_db)):
    return services.actualizar_informe_finalizado(db, informe_id, data)

@router.get("/docente/{docente_id}/pendientes-cabecera", response_model=List[schemas.InformeCatedraCabecera])
def listar_informes_pendientes_cabecera(docente_id: int, db: Session = Depends(get_db)):
    return services.obtener_informes_pendientes_cabecera(db, docente_id)

@router.post("/{informe_finalizado_id}/respuestas")
def guardar_respuestas_informe(informe_finalizado_id: int, payload: List[schemas.RespuestaInformeBase], db: Session = Depends(get_db)):
    return services.guardar_respuestas_informe(db, informe_finalizado_id, payload)

@router.put("/{informe_id}/borrador", response_model=dict)
def guardar_borrador(informe_id: int, payload: schemas.BorradorUpdate, db: Session = Depends(get_db)):
    return services.guardar_borrador(db, informe_id, payload)

@router.put("/{informe_id}/finalizar", response_model=dict)
def finalizar_informe(informe_id: int, db: Session = Depends(get_db)):
    return services.finalizar_informe(db, informe_id)

@router.get("/docente/{docente_id}/finalizados-cabecera", response_model=List[schemas.InformeCatedraCabecera])
def listar_informes_finalizados_cabecera(docente_id: int, db: Session = Depends(get_db)):
    return services.obtener_informes_finalizados_cabecera(db, docente_id)
