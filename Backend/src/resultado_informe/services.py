from typing import List
from sqlalchemy.orm import Session
from src.resultado_informe import schemas, models

def _crear_respuesta_db(informe_catedra_finalizado_id: int, pregunta_id: int, texto_respuesta: str, asignatura_id: int) -> models.ResultadoInforme:
    return models.ResultadoInforme(
        informe_catedra_finalizado_id=informe_catedra_finalizado_id,
        pregunta_id=pregunta_id,
        texto_respuesta=texto_respuesta,
        asignatura_id=asignatura_id
    )

def guardar_respuesta(db: Session, respuesta: schemas.RespuestaInformeCreate) -> models.ResultadoInforme:  
    respuesta_db = _crear_respuesta_db(
        respuesta.informe_catedra_finalizado_id,  
        respuesta.pregunta_id,
        respuesta.texto_respuesta,
        respuesta.asignatura_id
    )
    db.add(respuesta_db)
    db.commit()
    db.refresh(respuesta_db)
    
    return respuesta_db

def guardar_respuestas_lote(db: Session, respuestas: List[schemas.RespuestaInformeCreate]) -> List[models.ResultadoInforme]: 
    respuestas_db = []
    
    for respuesta_data in respuestas:
        respuesta_db = _crear_respuesta_db(
            respuesta_data.informe_catedra_finalizado_id,  
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