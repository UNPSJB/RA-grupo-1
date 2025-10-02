from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from . import models, schemas, exceptions
from src.asignaturas.models import Asignatura
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente

def listar_docentes(db: Session) -> List[schemas.Docente]:
    return db.scalars(select(models.Docente)).all()

def leer_docente(db: Session, docente_id: int) -> schemas.Docente:

    db_docente = db.scalar(select(models.Docente).where(models.Docente.id == docente_id))
    if db_docente is None:
        raise exceptions.DocenteNoEncontrado()
    return db_docente

def dar_asignatura(db: Session, docente_id: int, asignatura_id: int, duracion):
    docente = db.scalar(select(models.Docente).where(models.Docente.id == docente_id))
    asignatura = db.scalar(select(Asignatura).where(Asignatura.id == asignatura_id))
    if not docente or not asignatura:
        return None

    rel = AsignaturaDocente(docente_id=docente_id, asignatura_id=asignatura_id, duracion=duracion)
    db.add(rel)
    db.commit()
    db.refresh(rel)
    return rel

def observar_asignaturas_docente(db: Session, docente_id: int):
    conexiones = db.scalars(
        select(AsignaturaDocente).where(AsignaturaDocente.docente_id == docente_id)).all()
    
    return [
        {
            "id": r.asignatura.id,
            "nombre": r.asignatura.nombre,
            "matricula": r.asignatura.matricula,
            "duracion": r.duracion.name
        }
        for r in conexiones
    ]
