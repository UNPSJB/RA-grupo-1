from typing import List
from sqlalchemy.orm import Session
from src.respuestas_informe import schemas, models 

def _crear_respuesta_db(informe_catedra_finalizado_id: int, pregunta_id: int, opcion_id: int | None = None, texto_respuesta: str | None = None) -> models.RespuestaInforme:
    return models.RespuestaInforme(
        informe_catedra_completado_id=informe_catedra_finalizado_id,
        pregunta_id=pregunta_id,
        opcion_id=opcion_id,
        texto_respuesta=texto_respuesta
    )
    
def guardar_respuesta(db: Session, respuesta: schemas.RespuestaInformeCreate) -> schemas.RespuestaInforme:
    respuesta_db = _crear_respuesta_db(
        respuesta.informe_finalizado_id,  
        respuesta.pregunta_id,
        respuesta.opcion_id,
        respuesta.texto_respuesta
    )
    db.add(respuesta_db)
    db.commit()
    db.refresh(respuesta_db)
    
    return respuesta_db

def guardar_respuestas_lote(db: Session, respuestas: List[schemas.RespuestaInformeCreate]) -> List[models.RespuestaInforme]:
    respuestas_db = []
    
    for respuesta_data in respuestas:
        respuesta_db = _crear_respuesta_db(
            respuesta_data.informe_finalizado_id,  
            respuesta_data.pregunta_id,
            respuesta_data.texto_respuesta,
            respuesta_data.asignatura_id
        )
        db.add(respuesta_db)
        respuestas_db.append(respuesta_db)
    
    db.commit()
    
    for respuesta in respuestas_db:
        db.refresh(respuesta)
    
    return respuestas_db