from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.personas.models import Persona
from src.personas import schemas, exceptions

def crear_persona(db: Session, persona: schemas.PersonaCreate) -> schemas.Persona:
    _persona = Persona(**persona.model_dump())
    db.add(_persona)
    db.commit()
    db.refresh(_persona)
    return _persona

def listar_personas(db: Session) -> List[schemas.Persona]:
    return db.scalars(select(Persona)).all()
