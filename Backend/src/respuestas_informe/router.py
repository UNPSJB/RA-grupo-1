from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.respuestas_informe import schemas, services
#from src.users import schemas as user_schemas
#from src.auth.dependencies import tiene_rol_docente

router = APIRouter(prefix="/respuestas-informe", tags=["respuestas-informe"])

@router.post("/lote", response_model=list[schemas.RespuestaInforme])
def crear_respuestas_informe_lote(
    respuestas: list[schemas.RespuestaInformeCreate], 
    db: Session = Depends(get_db)
    #user: user_schemas.User = Depends(tiene_rol_docente)
):
    return services.guardar_respuestas_lote(db, respuestas)

@router.post("/", response_model=schemas.RespuestaInforme)
def crear_respuesta_informe(
    respuesta: schemas.RespuestaInformeCreate,  
    db: Session = Depends(get_db)
    #user: user_schemas.User = Depends(tiene_rol_docente)
):
    return services.guardar_respuesta(db, respuesta)