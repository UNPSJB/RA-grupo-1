from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.personas import schemas, exceptions

def crear_persona(db: Session, persona: schemas.PersonaCreate) -> schemas.Persona:
    # Verifica si existe una persona con el mismo DNI o email
    existing_persona = db.scalar(
        select(Persona).where(
            (Persona.dni == persona.dni) | (Persona.email == persona.email)
        )
    )
    if existing_persona:
        raise exceptions.PersonaDuplicada()
    
    try:
        # Crea la persona
        nueva_persona = Persona(
            nombre=persona.nombre,
            apellido=persona.apellido,
            legajo=persona.legajo,
            dni=persona.dni,
            email=persona.email,
            rol_id=persona.rol_id
        )
        db.add(nueva_persona)
        db.flush()  # obtiene el ID sin hacer commit
        
        # Según el rol_id, crea Docente o Alumno
        if persona.rol_id == 1:  # Docente
            docente = Docente(persona_id=nueva_persona.id)
            db.add(docente)
            
        elif persona.rol_id == 2:  # Alumno
            if not all([persona.CUIL, persona.usuario, persona.clave]):
                raise ValueError("Los campos CUIL, usuario y clave son obligatorios para alumnos")
            
            alumno = Alumno(
                persona_id=nueva_persona.id,
                CUIL=persona.CUIL,
                usuario=persona.usuario,
                clave=persona.clave
            )
            db.add(alumno)
        
        db.commit()
        db.refresh(nueva_persona)
        return nueva_persona
        
    except Exception as e:
        db.rollback()
        raise e
    
def listar_personas(db: Session) -> List[schemas.Persona]:
    return db.scalars(select(Persona)).all()

def leer_persona(db: Session, persona_id: int) -> schemas.Persona: 
    db_persona = db.scalar(select(Persona).where(Persona.id == persona_id))
    if db_persona is None:
        raise exceptions.PersonaNoEncontrada()  
    return db_persona

def modificar_persona(
    db: Session, persona_id: int, persona: schemas.PersonaUpdate
) -> schemas.Persona:
    db_persona = leer_persona(db, persona_id)
    
    # Verifica personas iguales excluyendo la persona actual
    existing_persona = db.scalar(
        select(Persona).where(
            ((Persona.dni == persona.dni) | (Persona.email == persona.email)) &
            (Persona.id != persona_id)
        )
    )
    if existing_persona:
        raise exceptions.PersonaDuplicada()
    
    db.execute(
        update(Persona)
        .where(Persona.id == persona_id)
        .values(**persona.model_dump(exclude_unset=True))
    )
    db.commit()
    db.refresh(db_persona)
    return db_persona

def eliminar_persona(db: Session, persona_id: int) -> dict:
    db_persona = leer_persona(db, persona_id)
    nombre_persona = db_persona.nombre
    
    # Verifica si la persona tiene registros relacionados antes de eliminarla
    if db_persona.rol_id == 2:  # Es alumno
        alumno = db.scalar(select(Alumno).where(Alumno.persona_id == persona_id))
        if alumno:
            db.delete(alumno)
    elif db_persona.rol_id == 1:  # Es docente
        docente = db.scalar(select(Docente).where(Docente.persona_id == persona_id))
        if docente:
            db.delete(docente)
    
    db.delete(db_persona)
    db.commit()
    return {"message": f"Persona {nombre_persona} eliminada correctamente"}

    try:
        nueva_persona = Persona(
            nombre=data.nombre,
            apellido=data.apellido,
            legajo=data.legajo,
            dni=data.dni,
            email=data.email,
            rol_id=data.rol_id
        )
        db.add(nueva_persona)
        db.flush()
        
        if data.rol_nombre == "Alumno":
            alumno = Alumno(
                persona_id=nueva_persona.id,
                CUIL=data.datos_alumno.CUIL,
                usuario=data.datos_alumno.usuario,
                clave=data.datos_alumno.clave
            )
            db.add(alumno)
        elif data.rol_nombre == "Docente":
            docente = Docente(persona_id=nueva_persona.id)
            db.add(docente)
        
        db.commit()
        db.refresh(nueva_persona)
        return nueva_persona
        
    except Exception:
        db.rollback() 
        raise