from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.personas import schemas, exceptions

def crear_persona(db: Session, persona: schemas.PersonaCreate) -> schemas.Persona:
    _persona = Persona(**persona.model_dump())
    db.add(_persona)
    db.commit()
    db.refresh(_persona)
    return _persona

def listar_personas(db: Session) -> List[schemas.Persona]:
    return db.scalars(select(Persona)).all()


def leer_personas(db: Session, persona_id: int) -> schemas.Persona:
    return db.scalar(select(Persona).where(Persona.id == persona_id))


def crear_persona_con_rol(db: Session, data: schemas.PersonaConRol):
    nueva_persona = Persona(
        nombre=data.nombre,
        apellido=data.apellido,
        legajo=data.legajo,
        dni=data.dni,
        email=data.email,
        rol_id=data.rol_id
    )
    db.add(nueva_persona)
    db.flush()  # Para obtener el ID
    
    # Según el rol, crear Alumno o Docente
    if data.rol_nombre == "Alumno":
        alumno = Alumno(
            persona_id=nueva_persona.id,
            CUIL=data.datos_alumno.CUIL,
            usuario=data.datos_alumno.usuario,
            clave=data.datos_alumno.clave
        )
        db.add(alumno)
    elif data.rol_nombre == "Docente":
        docente = Docente(
            persona_id=nueva_persona.id
            # campos específicos si hay
        )
        db.add(docente)
    
    db.commit()
    db.refresh(nueva_persona)
    return nueva_persona