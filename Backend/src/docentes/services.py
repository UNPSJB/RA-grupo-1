from typing import List, Optional
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload
from . import models, schemas, exceptions
from src.asignaturas.models import Asignatura
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.personas.models import Persona

def listar_docentes(db: Session) -> List[schemas.Docente]:
    return db.scalars(
        select(schemas.Docente)
        .options(joinedload(schemas.Docente.persona))
    ).unique().all()

def leer_docente(db: Session, docente_id: int) -> schemas.Docente:
    db_docente = db.scalar(select(models.Docente).where(models.Docente.id == docente_id))
    if db_docente is None:
        raise exceptions.DocenteNoEncontrado()
    return db_docente

def asignar_asignatura(db: Session, docente_id: int, asignatura_id: int, duracion):
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
    relaciones = db.scalars(
        select(AsignaturaDocente).where(AsignaturaDocente.docente_id == docente_id)
    ).all()

    return [
        {
            "id": r.asignatura.id,
            "nombre": r.asignatura.nombre,
            "matricula": r.asignatura.matricula,
            "duracion": r.duracion.name
        } 
        for r in relaciones
    ]

def obtener_relacion_docente_asignatura(db: Session, relacion_id: int):
    relacion = db.scalar(
        select(AsignaturaDocente).where(AsignaturaDocente.id == relacion_id)
    )
    if not relacion:
        return None
    return relacion

def eliminar_asignatura_docente(db: Session, docente_id: int, asignatura_id: int) -> bool:
    asignacion = db.scalar(
        select(AsignaturaDocente)
        .where(
            AsignaturaDocente.docente_id == docente_id,
            AsignaturaDocente.asignatura_id == asignatura_id
        )
    )
    
    if not asignacion:
        return False
    
    db.delete(asignacion)
    db.commit()
    return True

def crear_docente_desde_persona(db: Session, persona_id: int) -> Optional[models.Docente]:
    persona = db.scalar(select(Persona).where(Persona.id == persona_id))
    if not persona:
        return None
    
    docente_existente = db.scalar(
        select(models.Docente).where(models.Docente.persona_id == persona_id)
    )
    if docente_existente:
        return None
    
    nuevo_docente = models.Docente(persona_id=persona_id)
    db.add(nuevo_docente)
    db.commit()
    db.refresh(nuevo_docente)

    if persona.rol_id != 1:
        persona.rol_id = 1
        db.commit()

    return nuevo_docente
     
def buscar_docente_por_persona(db: Session, persona_id: int) -> Optional[models.Docente]:
    return db.scalar(
        select(models.Docente)
        .where(models.Docente.persona_id == persona_id)
        .options(joinedload(models.Docente.persona))
    )