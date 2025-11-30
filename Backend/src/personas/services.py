from typing import List
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.personas import schemas, exceptions

# services.py
def crear_persona(db: Session, persona: schemas.PersonaCreate) -> Persona:

    existente = db.scalar(
        select(Persona).where(
            (Persona.dni == persona.dni) | (Persona.email == persona.email)
        )
    )
    if existente:
        raise PersonaDuplicada()

    nueva = Persona(
        nombre=persona.nombre,
        apellido=persona.apellido,
        legajo=persona.legajo,
        dni=persona.dni,
        email=persona.email,
        rol_id=persona.rol_id
    )

    db.add(nueva)
    db.flush()

    if persona.rol_id == 1:  # DOCENTE
        docente = Docente(
            persona_id=nueva.id,
            usuario=persona.usuario,
            clave=persona.clave
        )
        db.add(docente)

    elif persona.rol_id == 2:  # ALUMNO
        alumno = Alumno(
            persona_id=nueva.id,
            CUIL=persona.CUIL,
            usuario=persona.usuario,
            clave=persona.clave
        )
        db.add(alumno)

    db.commit()
    db.refresh(nueva)
    return nueva

def listar_personas(db: Session) -> List[schemas.Persona]:
    return db.scalars(select(Persona)).all()

def leer_persona(db: Session, persona_id: int) -> Persona:
    persona = db.scalar(select(Persona).where(Persona.id == persona_id))
    if not persona:
        raise exceptions.PersonaNoEncontrada()
    return persona

def modificar_persona(db: Session, persona_id: int, datos: schemas.PersonaUpdate) -> Persona:
    persona_db = leer_persona(db, persona_id)

    campos = datos.model_dump(exclude_unset=True)

    if "dni" in campos or "email" in campos:
        existente = db.scalar(
            select(Persona).where(
                (Persona.id != persona_id) &
                ((Persona.dni == campos.get("dni")) |
                 (Persona.email == campos.get("email")))
            )
        )
        if existente:
            raise exceptions.PersonaDuplicada()

    db.execute(
        update(Persona)
        .where(Persona.id == persona_id)
        .values(**campos)
    )
    db.commit()
    db.refresh(persona_db)
    return persona_db

def eliminar_persona(db: Session, persona_id: int) -> dict:
    persona_db = leer_persona(db, persona_id)
    if persona_db.rol_id == 2:
        alumno = db.scalar(select(Alumno).where(Alumno.persona_id == persona_id))
        if alumno:
            db.delete(alumno)

    elif persona_db.rol_id == 1:
        docente = db.scalar(select(Docente).where(Docente.persona_id == persona_id))
        if docente:
            db.delete(docente)

    db.delete(persona_db)
    db.commit()

    return {"message": f"Persona {persona_db.nombre} eliminada correctamente"}