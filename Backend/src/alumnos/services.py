from typing import List, Optional
from sqlalchemy import select, update, and_
from sqlalchemy.orm import Session
from src.alumnos.models import Alumno
from src.alumnos import schemas, exceptions
from src.personas.models import Persona  
from src.vinculaciones.models import alumno_asignatura
from src.encuestas.models import Encuesta
from src.asignaturas.models import Asignatura

# operaciones CRUD para alumnos

def crear_alumno(db: Session, alumno: schemas.AlumnoCreate) -> schemas.AlumnoResponse:
    # Verifica que la persona existe
    persona = db.scalar(select(Persona).where(Persona.id == alumno.persona_id))
    if not persona:
        raise exceptions.PersonaNoEncontrada()
    
    # Verifica que el CUIL no esté duplicado
    alumno_existente = db.scalar(select(Alumno).where(Alumno.CUIL == alumno.CUIL))
    if alumno_existente:
        raise exceptions.CUILDuplicado()
    
    _alumno = Alumno(**alumno.model_dump())
    db.add(_alumno)
    db.commit()
    db.refresh(_alumno)
    return _alumno


def listar_alumnos(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.AlumnoResponse]:
    return db.scalars(select(Alumno).offset(skip).limit(limit)).all()

def leer_alumno(db: Session, alumno_id: int) -> schemas.AlumnoResponse:
    db_alumno = db.scalar(select(Alumno).where(Alumno.id == alumno_id))
    if db_alumno is None:
        raise exceptions.AlumnoNoEncontrado() 
    return db_alumno


def leer_alumno(db: Session, alumno_id: int) -> schemas.AlumnoResponse:
    db_alumno = db.scalar(select(Alumno).where(Alumno.id == alumno_id))
    if db_alumno is None:
        raise exceptions.AlumnoNoEncontrada()
    return db_alumno


def modificar_alumno(
    db: Session, alumno_id: int, alumno: schemas.AlumnoUpdate
) -> schemas.AlumnoResponse:
    db_alumno = leer_alumno(db, alumno_id)
    
    # Filtrar campos None para actualización parcial
    update_data = alumno.model_dump(exclude_unset=True)
    if not update_data:
        return db_alumno
    
    db.execute(
        update(Alumno)
        .where(Alumno.id == alumno_id)
        .values(**update_data)
    )
    db.commit()
    db.refresh(db_alumno)
    return db_alumno


def eliminar_alumno(db: Session, alumno_id: int) -> dict:
    db_alumno = leer_alumno(db, alumno_id)
    db.delete(db_alumno)
    db.commit()
    return {"message": f"Alumno con ID {alumno_id} eliminado correctamente"}


def obtener_encuestas_disponibles(db: Session, alumno_id: int) -> List[schemas.EncuestaDisponible]:

    # Verifica que el alumno existe
    alumno = leer_alumno(db, alumno_id)
    
    stmt = (
        select(Encuesta)
        .join(Asignatura, Encuesta.id == Asignatura.encuesta_id)
        .join(alumno_asignatura, Asignatura.id == alumno_asignatura.c.asignatura_id)
        .where(alumno_asignatura.c.alumno_id == alumno_id)
    )
    
    encuestas = db.scalars(stmt).all()
    return encuestas

def obtener_asignaturas_alumno(db: Session, alumno_id: int) -> List[schemas.AsignaturaBase]:
    # Obtiene asignaturas de un alumno
    
    alumno = leer_alumno(db, alumno_id)
    return alumno.asignaturas

def inscribir_alumno_asignatura(db: Session, alumno_id: int, asignatura_id: int) -> dict:
    # Inscribe alumno en una asignatura
    
    alumno = leer_alumno(db, alumno_id)
    
    # Verifica que la asignatura existe
    asignatura = db.scalar(select(Asignatura).where(Asignatura.id == asignatura_id))
    if not asignatura:
        raise exceptions.AsignaturaNoEncontrada()
    
    # Verifica que no esté ya inscrito
    stmt = select(alumno_asignatura).where(
        and_(
            alumno_asignatura.c.alumno_id == alumno_id,
            alumno_asignatura.c.asignatura_id == asignatura_id
        )
    )
    existe_inscripcion = db.scalar(stmt)
    if existe_inscripcion:
        raise exceptions.AlumnoYaInscrito()
    
    # Realiza la inscripción
    db.execute(
        alumno_asignatura.insert().values(
            alumno_id=alumno_id,
            asignatura_id=asignatura_id
        )
    )
    db.commit()
    
    return {"message": "Alumno inscrito correctamente en la asignatura"}