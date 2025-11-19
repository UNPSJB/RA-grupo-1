from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

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