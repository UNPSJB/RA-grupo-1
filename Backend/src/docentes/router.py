from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select 
from typing import List
from src.database import get_db
from src.vinculaciones.models import Duracion
from src.docentes import schemas
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.asignaturas.models import Asignatura
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.docentes import services
from src.docentes import services as docente_services
from src.indicadores import services as indicadores_services
from src.informe_catedra_finalizado import services as informe_services

router = APIRouter(prefix="/docentes", tags=["docentes"])

@router.get("/", response_model=List[schemas.Docente])
def read_docentes(db: Session = Depends(get_db)):
    return services.listar_docentes(db)

@router.get("/{docente_id}", response_model=schemas.Docente)
def read_docente(docente_id: int, db: Session = Depends(get_db)):
    docente = services.leer_docente(db, docente_id)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return docente

@router.post("/{docente_id}/asignaturas/{asignatura_id}")
def asignar_asignatura_docente(
    docente_id: int, 
    asignatura_id: int, 
    duracion: Duracion,
    db: Session = Depends(get_db)
):
    resultado = services.asignar_asignatura(db, docente_id, asignatura_id, duracion)
    if not resultado:
        raise HTTPException(
            status_code=404, 
            detail="Docente o asignatura no encontrados"
        )
    return {"mensaje": "Asignatura asignada correctamente al docente"}

@router.get("/{docente_id}/asignaturas")
def obtener_asignaturas_docente(docente_id: int, db: Session = Depends(get_db)):
    docente = services.leer_docente(db, docente_id)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    
    asignaturas = services.observar_asignaturas_docente(db, docente_id)
    return {
        "docente_id": docente.id,
        "persona": {
            "nombre": docente.persona.nombre,
            "apellido": docente.persona.apellido
        },
        "asignaturas": asignaturas
    }

@router.get("/asignatura_relacion/{relacion_id}")
def obtener_relacion(relacion_id: int, db: Session = Depends(get_db)):
    relacion = docente_services.observar_asignaturas_docente(db, relacion_id)
    if not relacion:
        return {"error": "Relación no encontrada"}
    return {
        "relacion_id": relacion.id,
        "docente_id": relacion.docente_id,
        "asignatura_id": relacion.asignatura_id,
        "anio": relacion.anio,
        "duracion": relacion.duracion.name,
    }

@router.get("/{docente_id}/dashboard-estadistico", response_model=schemas.DashboardDocenteResponse)
def get_dashboard_docente(
    docente_id: int, 
    anio: int, 
    duracion: Duracion, 
    db: Session = Depends(get_db)
):
    ID_ENCUESTA_BASICO = 1
    ID_ENCUESTA_SUPERIOR = 4

    cantidad_total = estadisticas_services.get_cantidad_total_encuestas_docente(db, docente_id, anio, duracion)
    stats_basico = estadisticas_services.get_promedio_encuestas_docente_por_ciclo(db, docente_id, anio, duracion, ID_ENCUESTA_BASICO)
    stats_superior = estadisticas_services.get_promedio_encuestas_docente_por_ciclo(db, docente_id, anio, duracion, ID_ENCUESTA_SUPERIOR)
    stats_general = estadisticas_services.get_promedio_general_docente(db, docente_id, anio, duracion)
    stmt_asignaturas = (
        select(Asignatura)
        .join(AsignaturaDocente, Asignatura.id == AsignaturaDocente.asignatura_id)
        .where(AsignaturaDocente.docente_id == docente_id)
        .where(AsignaturaDocente.anio == anio)
        .where(AsignaturaDocente.duracion == duracion)
    )
    asignaturas_db = db.scalars(stmt_asignaturas).all()
    
    lista_asignaturas_info = [
        schemas.AsignaturaInfo(id=m.id, nombre=m.nombre, codigo=m.matricula) 
        for m in asignaturas_db
    ]

    asignatura_ids = [m.id for m in asignaturas_db]
    completados_count = 0
    pendientes_lista = []

    if asignatura_ids:
        informes_hechos = db.scalars(
            select(InformeCatedraFinalizado)
            .join(AsignaturaDocente)
            .where(AsignaturaDocente.docente_id == docente_id)
            .where(AsignaturaDocente.asignatura_id.in_(asignatura_ids))
            .where(InformeCatedraFinalizado.anio == anio)
            .where(InformeCatedraFinalizado.duracion == duracion)
        ).all()
        
        completados_count = len(informes_hechos)
        ids_asignaturas_hechas = [i.asignatura_docente.asignatura_id for i in informes_hechos]
        docente_info = services.leer_docente(db, docente_id)
        nombre_completo = f"{docente_info.nombre} {docente_info.apellido}" if docente_info else "Desconocido"

        for asignatura in asignaturas_db:
            if asignatura.id not in ids_asignaturas_hechas:
                pendientes_lista.append({
                    "asignatura": asignatura.nombre,
                    "docente_responsable": nombre_completo
                })

    total_esperados = len(asignaturas_db)
    pendientes_count = total_esperados - completados_count

    progreso_data = {
        "completados": completados_count,
        "pendientes": pendientes_count
    }

    return schemas.DashboardDocenteResponse(
        total_encuestas_completadas=cantidad_total, 
        estadisticas_general=stats_general,        
        estadisticas_basico=stats_basico,
        estadisticas_superior=stats_superior,
        asignaturas_del_ciclo=lista_asignaturas_info,
        progreso=progreso_data,
        pendientes=pendientes_lista
    )



@router.delete("/{docente_id}/asignaturas/{asignatura_id}")
def eliminar_asignatura_docente(
    docente_id: int, 
    asignatura_id: int, 
    db: Session = Depends(get_db)
):
    resultado = services.eliminar_asignatura_docente(db, docente_id, asignatura_id)
    if not resultado:
        raise HTTPException(
            status_code=404, 
            detail="Asignación no encontrada"
        )
    return {"mensaje": "Asignatura eliminada del docente correctamente"}

@router.post("/persona/{persona_id}")
def crear_docente_desde_persona(
    persona_id: int, 
    db: Session = Depends(get_db)
):
    # Convierte una persona en docente
    resultado = services.crear_docente_desde_persona(db, persona_id)
    if not resultado:
        raise HTTPException(
            status_code=400, 
            detail="No se pudo crear el docente. La persona no existe o ya es docente"
        )
    return {"mensaje": "Docente creado correctamente", "docente": resultado}