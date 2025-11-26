from typing import List, Optional
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload
from . import models, schemas, exceptions
from src.asignaturas.models import Asignatura
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.vinculaciones.models import asignatura_alumno, alumno_encuesta
from src.personas.models import Persona
from datetime import datetime

def listar_docentes(db: Session) -> List[models.Docente]:
    # Lista todos los docentes con información de persona
    return db.scalars(
        select(models.Docente)
        .options(joinedload(models.Docente.persona))
    ).unique().all()

def leer_docente(db: Session, docente_id: int) -> models.Docente:
    # Obtiene un docente específico con información de persona
    db_docente = db.scalar(
        select(models.Docente)
        .where(models.Docente.id == docente_id)
        .options(joinedload(models.Docente.persona))
    )
    if db_docente is None:
        raise exceptions.DocenteNoEncontrado()
    return db_docente

def asignar_asignatura(db: Session, docente_id: int, asignatura_id: int, duracion: str) -> Optional[AsignaturaDocente]:
    # Asigna una asignatura a un docente 
    docente = db.scalar(
        select(models.Docente)
        .where(models.Docente.id == docente_id)
        .options(joinedload(models.Docente.persona))
    )
    asignatura = db.scalar(select(Asignatura).where(Asignatura.id == asignatura_id))
    
    if not docente or not asignatura:
        return None

    # Verifica si ya existe la asignación
    asignacion_existente = db.scalar(
        select(AsignaturaDocente)
        .where(
            AsignaturaDocente.docente_id == docente_id,
            AsignaturaDocente.asignatura_id == asignatura_id
        )
    )
    
    if asignacion_existente:
        raise exceptions.AsignaturaYaAsignada()

    # Crea una nueva relación
    rel = AsignaturaDocente(
        docente_id=docente_id, 
        asignatura_id=asignatura_id,
        anio=datetime.now().year,
        duracion=duracion
    )
    db.add(rel)
    db.commit()
    db.refresh(rel)
    return rel

def observar_asignaturas_docente(db: Session, docente_id: int) -> List[dict]:
    # Obtiene todas las asignaturas de un docente específico
    # Verifica que el docente existe
    docente = leer_docente(db, docente_id)
    
    conexiones = db.scalars(
        select(AsignaturaDocente)
        .where(AsignaturaDocente.docente_id == docente_id)
        .options(joinedload(AsignaturaDocente.asignatura))
    ).all()
    
    return [
        {
            "id": r.asignatura.id,
            "nombre": r.asignatura.nombre,
            "matricula": r.asignatura.matricula,
            "duracion": r.duracion
        }
        for r in conexiones
    ]

def eliminar_asignatura_docente(db: Session, docente_id: int, asignatura_id: int) -> bool:
    # Elimina asignatura de un docente
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
    # Convierte una persona existente en un docente
    # Verifica si la persona existe
    persona = db.scalar(select(Persona).where(Persona.id == persona_id))
    if not persona:
        return None
    
    # Verifica si ya es docente
    docente_existente = db.scalar(
        select(models.Docente).where(models.Docente.persona_id == persona_id)
    )
    if docente_existente:
        return None
    
    # Crea un nuevo docente
    nuevo_docente = models.Docente(persona_id=persona_id)
    db.add(nuevo_docente)
    db.commit()
    db.refresh(nuevo_docente)

    if persona.rol_id != 1:
        persona.rol_id = 1
        db.commit()

    return nuevo_docente
     
def buscar_docente_por_persona(db: Session, persona_id: int) -> Optional[models.Docente]:
    # Busca docente por ID de persona
    return db.scalar(
        select(models.Docente)
        .where(models.Docente.persona_id == persona_id)
        .options(joinedload(models.Docente.persona))
    )