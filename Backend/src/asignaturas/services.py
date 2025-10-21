from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.asignaturas.models import Asignatura
from src.asignaturas import schemas, exceptions

def listar_asignaturas(db: Session) -> List[schemas.Asignatura]:
    """Listar todas las asignaturas"""
    return db.scalars(select(Asignatura)).all()

def leer_asignatura(db: Session, asignatura_id: int) -> schemas.Asignatura:
    """Obtener una asignatura por ID"""
    db_asignatura = db.scalar(select(Asignatura).where(Asignatura.id == asignatura_id))
    if db_asignatura is None:
        raise exceptions.AsignaturaNoEncontrada()
    return db_asignatura

def buscar_asignatura_por_matricula(db: Session, matricula: str) -> Optional[schemas.Asignatura]:
    """Buscar asignatura por matrícula"""
    return db.scalar(select(Asignatura).where(Asignatura.matricula == matricula))

def crear_asignatura(db: Session, asignatura: schemas.AsignaturaCreate) -> schemas.Asignatura:
    """Crear una nueva asignatura"""
    # Verificar si ya existe la matrícula
    if buscar_asignatura_por_matricula(db, asignatura.matricula):
        raise exceptions.AsignaturaYaExiste()
    
    db_asignatura = Asignatura(**asignatura.dict())
    db.add(db_asignatura)
    db.commit()
    db.refresh(db_asignatura)
    return db_asignatura

def actualizar_asignatura(db: Session, asignatura_id: int, asignatura_actualizada: schemas.AsignaturaBase) -> schemas.Asignatura:
    """Actualizar una asignatura existente"""
    db_asignatura = leer_asignatura(db, asignatura_id)
    
    # Verificar si la nueva matrícula ya existe en otra asignatura
    if asignatura_actualizada.matricula != db_asignatura.matricula:
        if buscar_asignatura_por_matricula(db, asignatura_actualizada.matricula):
            raise exceptions.AsignaturaYaExiste()
    
    for field, value in asignatura_actualizada.dict().items():
        setattr(db_asignatura, field, value)
    
    db.commit()
    db.refresh(db_asignatura)
    return db_asignatura

def eliminar_asignatura(db: Session, asignatura_id: int) -> None:
    """Eliminar una asignatura"""
    db_asignatura = leer_asignatura(db, asignatura_id)
    db.delete(db_asignatura)
    db.commit()