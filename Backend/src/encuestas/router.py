from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas import schemas, services
from src.categorias import schemas as categoria_schemas
from src.preguntas import schemas as pregunta_schemas
from typing import List
from src.encuestas.exceptions import (
    EncuestaNoEncontrada,
    FechasEncuestaInvalidas, 
    EncuestaNoDisponible,
    EncuestaYaRespondida
)

router = APIRouter(prefix="/encuestas", tags=["encuestas"])

@router.get("/", 
            response_model=List[schemas.Encuesta],
            summary="Listar todas las encuestas",
            description="Retorna una lista de todas las encuestas")
def read_encuestas(db: Session = Depends(get_db)):
    return services.listar_encuestas(db)

@router.get("/{encuesta_id}", response_model=schemas.Encuesta)
def read_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene una encuesta específica
    encuesta = services.leer_encuesta(db, encuesta_id)
    if not encuesta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return encuesta

# crea encuesta
@router.post("/", response_model=schemas.Encuesta, status_code=status.HTTP_201_CREATED)
def create_encuesta(encuesta: schemas.EncuestaCreate, db: Session = Depends(get_db)):
    try:
        return services.crear_encuesta(db, encuesta)
    except FechasEncuestaInvalidas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las fechas de la encuesta son inválidas. La fecha de inicio debe ser anterior a la fecha de fin"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/{encuesta_id}/alumnos", response_model=List[schemas.EstadoEncuesta])
def read_alumnos_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene alumnos vinculados a una encuesta
    return services.listar_alumnos_encuesta(db, encuesta_id)
 
@router.put("/{encuesta_id}", response_model=schemas.Encuesta)
def update_encuesta(encuesta_id: int, encuesta: schemas.EncuestaUpdate, db: Session = Depends(get_db)):
    # Actualiza una encuesta existente
    encuesta_actualizada = services.modificar_encuesta(db, encuesta_id, encuesta)
    if not encuesta_actualizada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return encuesta_actualizada

@router.delete("/{encuesta_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Elimina una encuesta
    try:
        services.eliminar_encuesta(db, encuesta_id)
        return None
    except EncuestaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )

@router.get("/{encuesta_id}/categorias", response_model=List[categoria_schemas.Categoria])
def read_categorias_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene categorías de una encuesta específica
    # Primero verifica que la encuesta existe
    encuesta = services.leer_encuesta(db, encuesta_id)
    if not encuesta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return services.listar_categorias_encuesta(db, encuesta_id)

@router.get("/{encuesta_id}/preguntas", response_model=List[pregunta_schemas.Pregunta])
def read_preguntas_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene preguntas de una encuesta específica
    # Primero verificar que la encuesta existe
    encuesta = services.leer_encuesta(db, encuesta_id)
    if not encuesta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return services.listar_preguntas_encuesta(db, encuesta_id)

@router.post("/{encuesta_id}/alumnos/{alumno_id}", response_model=schemas.Encuesta)
def vincular_alumno_encuesta(encuesta_id: int, alumno_id: int, db: Session = Depends(get_db)):
    # Vincula un alumno a una encuesta
    return services.vincular_alumno_encuesta(db, encuesta_id, alumno_id)

@router.get("/{encuesta_id}/respuestas", response_model=list[schemas.PreguntaConRespuestas])
def obtener_respuestas(encuesta_id: int, db: Session = Depends(get_db)):
    return services.obtener_respuestas_por_encuesta(db, encuesta_id)


