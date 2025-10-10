from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from src.database import get_db
from src.alumnos import schemas, services

router = APIRouter(prefix="/alumnos", tags=["alumnos"])

@router.post("/", 
             response_model=schemas.Alumno,
             status_code=status.HTTP_201_CREATED,
             summary="Crear un nuevo alumno",
             description="Crea un nuevo registro de alumno en el sistema")
def create_alumno(alumno: schemas.AlumnoCreate, db: Session = Depends(get_db)):
    try:
        return services.crear_alumno(db, alumno)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear alumno: {str(e)}"
        )

@router.get("/", 
            response_model=List[schemas.Alumno],
            summary="Listar todos los alumnos",
            description="Retorna una lista de todos los alumnos registrados")
def read_alumnos(
    skip: int = Query(0, description="Número de registros a saltar"),
    limit: int = Query(100, description="Límite de registros a retornar"),
    db: Session = Depends(get_db)
):
    return services.listar_alumnos(db, skip=skip, limit=limit)

@router.get("/{alumno_id}", 
            response_model=schemas.Alumno,
            summary="Obtener alumno por ID",
            description="Retorna los detalles de un alumno específico")
def read_alumno(alumno_id: int, db: Session = Depends(get_db)):
    alumno = services.leer_alumno(db, alumno_id)  
    if not alumno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumno no encontrado"
        )
    return alumno

@router.put("/{alumno_id}", 
            response_model=schemas.Alumno,
            summary="Actualizar alumno",
            description="Actualiza la información de un alumno existente")
def update_alumno(
    alumno_id: int, 
    alumno: schemas.AlumnoUpdate, 
    db: Session = Depends(get_db)
):
    updated_alumno = services.modificar_alumno(db, alumno_id, alumno)
    if not updated_alumno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumno no encontrado"
        )
    return updated_alumno

@router.delete("/{alumno_id}", 
               response_model=schemas.AlumnoDeleteResponse,
               summary="Eliminar alumno",
               description="Elimina un alumno del sistema")
def delete_alumno(alumno_id: int, db: Session = Depends(get_db)):
    result = services.eliminar_alumno(db, alumno_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumno no encontrado"
        )
    return {"message": "Alumno eliminado correctamente", "id": alumno_id}

@router.get("/{alumno_id}/encuestas_disponibles",
            response_model=List[schemas.EncuestaDisponible],
            summary="Encuestas disponibles para alumno",
            description="Retorna las encuestas que el alumno puede completar")
def get_encuestas_disponibles(alumno_id: int, db: Session = Depends(get_db)):
    encuestas = services.obtener_encuestas_disponibles(db, alumno_id)
    if encuestas is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumno no encontrado"
        )
    return encuestas

@router.get("/{alumno_id}/asignaturas",
            response_model=List[schemas.AsignaturaAlumno],
            summary="Asignaturas del alumno",
            description="Retorna las asignaturas en las que está inscrito el alumno")
def get_asignaturas_alumno(alumno_id: int, db: Session = Depends(get_db)):
    return services.obtener_asignaturas_alumno(db, alumno_id)