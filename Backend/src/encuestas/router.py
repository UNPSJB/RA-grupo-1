from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.encuestas import schemas, services
from src.categorias import schemas as categoria_schemas
from src.preguntas import schemas as pregunta_schemas
from src.encuestas.models import Encuesta, EstadoEncuesta
from src.preguntas.models import Pregunta, TipoPreguntaEnum
from src.asignaturas.models import Asignatura
from src.docentes.models import Docente
from src.encuestas.models import Encuesta
from src.encuesta_finalizada.models import EncuestaFinalizada


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
    return services.listar_encuestas_activas(db)

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

@router.get("/{encuesta_id}/respuestas/{alumno_id}", summary="Obtener respuestas del alumno (solo lectura)")
def obtener_respuestas_alumno(encuesta_id: int, alumno_id: int, db: Session = Depends(get_db)):
    respuestas = (
        db.query(Respuesta)
        .options(joinedload(Respuesta.pregunta))
        .filter(Respuesta.encuesta_id == encuesta_id, Respuesta.alumno_id == alumno_id)
        .all()
    )

    if not respuestas:
        raise HTTPException(status_code=404, detail="No se encontraron respuestas para esta encuesta.")

    data = [
        {
            "pregunta_id": r.pregunta_id,
            "pregunta_texto": r.pregunta.texto,
            "respuesta": r.texto_respuesta or r.opcion_seleccionada or r.subrespuestas
        }
        for r in respuestas
    ]

    return {"encuesta_id": encuesta_id, "respuestas": data}

@router.get("/alumno/{alumno_id}/disponibles", 
           response_model=List[schemas.EncuestaAlumnoInfo],
           summary="Obtener encuestas disponibles para alumno")
def obtener_encuestas_alumno(alumno_id: int, db: Session = Depends(get_db)):
    try:
        encuestas = services.listar_encuestas_para_alumno(db, alumno_id)
        return encuestas
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener encuestas: {str(e)}"
        )

@router.get("/{encuesta_id}/completar",
           response_model=schemas.EncuestaParaCompletar,  
           summary="Obtener encuesta para completar")
def obtener_encuesta_completar(encuesta_id: int, db: Session = Depends(get_db)):
    try:
        encuesta = services.obtener_encuesta_para_completar(db, encuesta_id)  
        return encuesta
    except EncuestaNoEncontrada:  
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    except EncuestaNoDisponible:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La encuesta no está disponible en este momento"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener encuesta: {str(e)}"
        )

@router.post("/respuestas",
            status_code=status.HTTP_201_CREATED,
            summary="Guardar respuestas de encuesta")
def guardar_respuestas(respuestas: schemas.RespuestaEncuesta, db: Session = Depends(get_db)):
    """
    Guarda las respuestas de una encuesta finalizada por un alumno
    """
    try:
        resultado = services.guardar_respuestas_encuesta(db, respuestas)
        return resultado
    except EncuestaNoEncontrada:  
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    except EncuestaNoDisponible:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La encuesta no está disponible"
        )
    except EncuestaYaRespondida:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya has completado esta encuesta"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al guardar respuestas: {str(e)}"
        )
@router.get("/alumno/{alumno_id}/finalizadas", response_model=list[schemas.EncuestaAlumnoInfo])
def listar_encuestas_finalizadas(alumno_id: int, db: Session = Depends(get_db)):
    """
    Devuelve todas las encuestas que el alumno ya completó.
    """
    encuestas_finalizadas = (
        db.query(EncuestaFinalizada)
        .filter(EncuestaFinalizada.alumno_id == alumno_id)
        .all()
    )

    if not encuestas_finalizadas:
        return []

    resultado = []
    for finalizada in encuestas_finalizadas:
        encuesta = db.query(Encuesta).filter(Encuesta.id == finalizada.encuesta_id).first()
        if not encuesta:
            continue

        asignatura = db.query(Asignatura).filter(Asignatura.id == finalizada.asignatura_id).first()
        docente = db.query(Docente).filter(Docente.id == finalizada.docente_id).first() if finalizada.docente_id else None

        resultado.append({
            "id": encuesta.id,
            "nombre": encuesta.nombre,
            "asignatura": asignatura.nombre if asignatura else "Desconocida",
            "docente": f"{docente.nombre} {docente.apellido}" if docente else "No asignado",
            "ciclo_lectivo": encuesta.ciclo_lectivo,
            "fecha_inicio": encuesta.fecha_inicio,
            "fecha_fin": encuesta.fecha_fin,
            "estado": "cerrada",
        })

    return resultado
