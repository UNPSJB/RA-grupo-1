from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.database import get_db
from . import schemas, services
from src.respuestas.models import Respuesta
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.preguntas.models import Pregunta
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

class SubrespuestaSchema(BaseModel):
    subpregunta_id: Optional[int]
    valor: Optional[str]

class RespuestaSchema(BaseModel):
    pregunta_id: int
    opcion_seleccionada: Optional[str] = None
    texto_respuesta: Optional[str] = None
    subrespuestas: Optional[dict] = None

class EnviarEncuestaSchema(BaseModel):
    alumno_id: int
    encuesta_id: int
    asignatura_id: Optional[int] = None
    respuestas: List[RespuestaSchema]

@router.post("/enviar", summary="Guardar respuestas y finalizar encuesta del alumno")
def enviar_respuestas(payload: EnviarEncuestaSchema, db: Session = Depends(get_db)):
    encuesta_id = payload.encuesta_id
    alumno_id = payload.alumno_id

    # Verificar si ya fue completada
    ya_finalizada = db.query(EncuestaFinalizada).filter_by(
        encuesta_id=encuesta_id, alumno_id=alumno_id
    ).first()

    if ya_finalizada:
        raise HTTPException(status_code=400, detail="La encuesta ya fue completada por este alumno.")

    # Guardar respuestas
    for r in payload.respuestas:
        nueva = Respuesta(
            pregunta_id=r.pregunta_id,
            alumno_id=alumno_id,
            encuesta_id=encuesta_id,
            texto_respuesta=r.texto_respuesta,
            opcion_seleccionada=r.opcion_seleccionada,
            subrespuestas=r.subrespuestas,
            fecha=datetime.now()
        )
        db.add(nueva)

    # Registrar encuesta finalizada
    registro = EncuestaFinalizada(
        encuesta_id=encuesta_id,
        alumno_id=alumno_id,
        fecha_finalizacion=datetime.now()
    )
    db.add(registro)

    db.commit()
    return {"mensaje": "✅ Encuesta guardada y marcada como completada"}

@router.post("/", response_model=schemas.RespuestaOut, status_code=status.HTTP_201_CREATED)
def crear_respuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    # Crea una nueva respuesta
    try:
        return services.crear_respuesta(db, respuesta)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error interno del servidor"
        )
    
@router.post(
    "/lote",
    response_model=list[schemas.RespuestaOut],
    status_code=status.HTTP_201_CREATED
)

def crear_respuestas_lote(respuestas: list[schemas.RespuestaCreate], db: Session = Depends(get_db)):
    # Crea múltiples respuestas en lote
    try:
        return services.crear_respuestas_lote(db, respuestas)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/", response_model=list[schemas.RespuestaOut])
def listar_respuestas(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Número de registros a saltar"),
    limit: int = Query(100, ge=1, le=1000, description="Límite de registros")
):
    return services.listar_respuestas(db, skip=skip, limit=limit)

@router.get("/alumno/{alumno_id}", response_model=list[schemas.RespuestaOut])
def obtener_respuestas_por_alumno(alumno_id: int, db: Session = Depends(get_db)):
    # Obtiene las respuestas por alumno
    try:
        return services.obtener_respuestas_por_alumno(db, alumno_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/pregunta/{pregunta_id}", response_model=list[schemas.RespuestaOut])
def obtener_respuestas_por_pregunta(pregunta_id: int, db: Session = Depends(get_db)):
    # Obtiene respuestas por pregunta
    try:
        return services.obtener_respuestas_por_pregunta(db, pregunta_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/{respuesta_id}", response_model=schemas.RespuestaOut)
def obtener_respuesta(respuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene una respuesta específica por ID
    try:
        return services.obtener_respuesta_por_id(db, respuesta_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/alumno/{alumno_id}/encuesta/{encuesta_id}/respuestas")
def obtener_respuestas_alumno_encuesta(alumno_id: int, encuesta_id: int, db: Session = Depends(get_db)):
    """
    Devuelve todas las respuestas del alumno para una encuesta específica
    """
    from src.respuestas.models import Respuesta
    from src.preguntas.models import Pregunta
    stmt = (
        select(Respuesta, Pregunta.texto)
        .join(Pregunta, Respuesta.pregunta_id == Pregunta.id)
        .where(Respuesta.alumno_id == alumno_id)
        .where(Pregunta.encuesta_id == encuesta_id)
    )
    resultados = db.execute(stmt).all()

    return [
        {"pregunta": pregunta_texto, "respuesta": r.respuesta_texto}
        for r, pregunta_texto in resultados
    ]
