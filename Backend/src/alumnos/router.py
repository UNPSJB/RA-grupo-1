from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.alumnos import schemas, services

router = APIRouter(prefix="/alumnos", tags=["alumnos"])

# Rutas para Personas

@router.post("/", response_model=schemas.Alumno)
def create_alumno(alumno: schemas.AlumnoCreate, db: Session = Depends(get_db)):
    return services.crear_alumno(db, alumno)


@router.get("/", response_model=list[schemas.Alumno])
def read_alumno(db: Session = Depends(get_db)):
    return services.listar_alumnos(db)


@router.get("/{alumno_id}", response_model=schemas.Alumno)
def read_persona(alumno_id: int, db: Session = Depends(get_db)):
    return services.leer_persona(db, alumno_id)


@router.put("/{alumno_id}", response_model=schemas.Alumno)
def update_alumno(
    alumno_id: int, alumno: schemas.AlumnoUpdate, db: Session = Depends(get_db)
):
    return services.modificar_alumno(db, alumno_id, alumno)


@router.delete("/{alumno_id}", response_model=dict)
def delete_alumno(alumno_id: int, db: Session = Depends(get_db)):
    return services.eliminar_alumno(db, alumno_id)