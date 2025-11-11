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

@router.get("/tabla_pregunta_2/", response_model=List[schemas.TablaPregunta2Item])
def get_tabla_porcentaje_horas(
    id_dpto: int = Query(...), 
    id_carrera: int = Query(...), 
    anio: int = Query(...), 
    duracion: str = Query(...),
    db: Session = Depends(get_db)):
    try:
        elementos = services.get_elementos_pregunta2(db, id_dpto, id_carrera, anio, duracion)
        return elementos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tabla de porcentaje de horas: {str(e)}")
 

@router.get("/informacion-general/", response_model=List[schemas.InformacionGeneral])
def obtener_informacion_general(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db)
):
    try:
        elementos = services.obtener_informacion_general(db, id_dpto, id_carrera, anio, duracion)
        if not elementos:
            raise HTTPException(status_code=404, detail="No se encontraron informes completados para los filtros dados.")
        return elementos
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener información general: {str(e)}")

@router.get("/temas-desarrollados/", response_model=List[schemas.TemasDesarrolladosItem])
def obtener_temas_desarrollados(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db)
):
    try:
        elementos = services.obtener_temas_desarrollados(db, id_dpto, id_carrera, anio, duracion)
        return elementos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener temas desarrollados: {str(e)}")

@router.get("/tabla_pregunta_2C/", response_model=List[schemas.TablaPregunta2CItem])
def get_preguntas_2C(
    id_dpto: int = Query(...),
    id_carrera: int = Query(...),
    anio: int = Query(...),
    duracion: str = Query(...),
    db: Session = Depends(get_db)
):
    try:
        elementos = services.get_elementos_pregunta2C(db, id_dpto, id_carrera, anio, duracion)
        if not elementos:
            raise HTTPException(status_code=404, detail="No se encontraron respuestas de cátedra para la sección 2.C con esos filtros.")
        return elementos
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener respuestas de sección 2C: {str(e)}")

@router.get("/bibliografia_equipamiento/", response_model=List[schemas.EquipamientoBibliografia]) 
def get_bibliografia_equipamiento(
    id_dpto: int = Query(...), 
    id_carrera: int = Query(...), 
    anio: int = Query(...), 
    duracion: str = Query(...),
    db: Session = Depends(get_db)):

    try:
        elementos = services.get_bibliografia_equipamiento(db, id_dpto, id_carrera, anio, duracion)
        return elementos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener bibliografía y equipamiento: {str(e)}")

@router.get("/actividades-docentes/", response_model=List[schemas.ActividadesPorMateriaItem])
def get_actividades_docentes_por_materia(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db)
):
    try:
        elementos = services.get_actividades_docentes(db, id_dpto, id_carrera, anio, duracion)
        return elementos
    except Exception as e:
        print(f"Error en get_actividades_docentes_por_materia: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener actividades docentes: {str(e)}")

@router.get("/desempeno_auxiliares/", response_model=List[schemas.TablaDesempenoAuxiliar])
def get_desempeno_auxiliares(
    id_dpto: int = Query(...), 
    id_carrera: int = Query(...), 
    anio: int = Query(...), 
    duracion: str = Query(...),
    db: Session = Depends(get_db)):
    try:
        elementos = services.get_desempeno_auxiliares(db, id_dpto, id_carrera, anio, duracion)
        return elementos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener desempeño de auxiliares: {str(e)}")