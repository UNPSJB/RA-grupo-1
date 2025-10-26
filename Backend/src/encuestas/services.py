from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, update
from sqlalchemy.orm import Session, selectinload
from src.encuestas.models import Encuesta, EstadoEncuesta
from src.encuestas import schemas, exceptions
from src.respuestas.schemas import RespuestaCreate
from src.respuestas.models import Respuesta
from src.preguntas.models import Pregunta
from src.categorias import schemas as categoria_schemas
from src.preguntas import schemas as pregunta_schemas

def listar_encuestas(db:Session) -> List[schemas.Encuesta]:
    return db.scalars(select(Encuesta)).all()

def listar_encuestas_activas(db: Session) -> List[schemas.Encuesta]:
    # Obtiene solo encuestas activas
    stmt = select(Encuesta).where(
        Encuesta.activa == True,
        Encuesta.estado == EstadoEncuesta.abierta,
        Encuesta.fecha_inicio <= datetime.utcnow(),
        Encuesta.fecha_fin >= datetime.utcnow()
    )
    return db.scalars(stmt).all()

def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> schemas.Encuesta:
    # Crea una nueva encuesta 
    if encuesta.fecha_inicio >= encuesta.fecha_fin:
        raise exceptions.FechasEncuestaInvalidas()
    
    _encuesta = Encuesta(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def leer_encuesta(db: Session, encuesta_id: int, cargar_relaciones: bool = False) -> schemas.Encuesta:
    # Obtiene una encuesta por ID
    stmt = select(Encuesta).where(Encuesta.id == encuesta_id)
    
    # Carga optimizada de relaciones
    if cargar_relaciones:
        stmt = stmt.options(
            selectinload(Encuesta.asignatura),
        )
    
    db_encuesta = db.scalar(stmt)
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta

def modificar_encuesta(
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaUpdate
) -> Encuesta:
    # Actualiza una encuesta existente
    db_encuesta = leer_encuesta(db, encuesta_id)
    
    update_data = encuesta.model_dump(exclude_unset=True)
    
    if not update_data:
        return db_encuesta  
    
    if 'fecha_inicio' in update_data and 'fecha_fin' in update_data:
        if update_data['fecha_inicio'] >= update_data['fecha_fin']:
            raise exceptions.FechasEncuestaInvalidas()
    
    db.execute(
        update(Encuesta)
        .where(Encuesta.id == encuesta_id)
        .values(**update_data)
    )
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def eliminar_encuesta(db: Session, encuesta_id: int) -> dict:
    db_encuesta = leer_encuesta(db, encuesta_id)
    
    db.execute(
        update(Encuesta)
        .where(Encuesta.id == encuesta_id)
        .values(activa=False, estado=EstadoEncuesta.cerrada)
    )
    db.commit()
    
    return {"message": f"Encuesta '{db_encuesta.titulo}' desactivada correctamente"}

def listar_categorias_encuesta(db: Session, encuesta_id: int) -> List[categoria_schemas.Categoria]:
    # Obtiene categorías de una encuesta específica
    db_encuesta = leer_encuesta(db, encuesta_id)
    return db_encuesta.categorias if hasattr(db_encuesta, 'categorias') else []

def listar_preguntas_encuesta(db: Session, encuesta_id: int) -> List[pregunta_schemas.Pregunta]:
    # Obtiene preguntas de una encuesta específica
    db_encuesta = leer_encuesta(db, encuesta_id)
    return db_encuesta.preguntas if hasattr(db_encuesta, 'preguntas') else []

#def listar_alumnos_encuesta(db: Session, encuesta_id: int) -> List[Any]:
    """Obtiene alumnos vinculados a una encuesta"""
#    db_encuesta = leer_encuesta(db, encuesta_id)
#    return db_encuesta.alumnos if hasattr(db_encuesta, 'alumnos') else []

def vincular_alumno_encuesta(db: Session, encuesta_id: int, alumno_id: int) -> schemas.Encuesta:
    # Vincula un alumno a una encuesta
    db_encuesta = leer_encuesta(db, encuesta_id)
    
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def validar_encuesta_activa(db: Session, encuesta_id: int) -> bool:
    # Valida si una encuesta está activa y en período válido
    encuesta = leer_encuesta(db, encuesta_id)
    ahora = datetime.utcnow()
    
    return (
        encuesta.activa and 
        encuesta.estado == EstadoEncuesta.abierta and
        encuesta.fecha_inicio <= ahora <= encuesta.fecha_fin
    )

def responder_encuesta(db: Session, respuesta: RespuestaCreate):
    encuesta = db.query(Encuesta).filter(Encuesta.id == respuesta.encuesta_id).first()
    if not encuesta or not encuesta.activa:
        raise Exception("Encuesta no activa o no encontrada")

    if not (encuesta.fecha_inicio <= datetime.utcnow() <= encuesta.fecha_fin):
        raise Exception("Encuesta fuera de período")

    
    db_respuesta = RespuestaEstudiante(
        estudiante_id=respuesta.estudiante_id,
        encuesta_id=respuesta.encuesta_id,
        respuesta_texto=respuesta.respuesta_texto,
        progreso=50  
    )
    db.add(db_respuesta)

def obtener_estadisticas_encuesta(db: Session, encuesta_id: int) -> dict:
    # Obtiene estadísticas de una encuesta
    encuesta = leer_encuesta(db, encuesta_id)
    
    total_alumnos = len(encuesta.alumnos) if hasattr(encuesta, 'alumnos') else 0
    
    return {
        "encuesta_id": encuesta_id,
        "titulo": encuesta.titulo,
        "total_alumnos": total_alumnos,
        "estado": encuesta.estado,
        "activa": encuesta.activa
    }