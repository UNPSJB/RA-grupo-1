from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas.models import Encuesta
from src.alumnos.models import AlumnoEncuesta

router = APIRouter(prefix="/encuestas_completadas", tags=["Encuestas Completadas"])
#ver que onda
@router.get("/{idAlumno}")
def get_encuestas_completadas(idAlumno: int, db: Session = Depends(get_db)):
    encuestas = (
        db.query(Encuesta)
        .join(AlumnoEncuesta, AlumnoEncuesta.encuesta_id == Encuesta.id)
        .filter(AlumnoEncuesta.alumno_id == idAlumno, AlumnoEncuesta.estado == "finalizada")
        .all()
    )
    return encuestas
