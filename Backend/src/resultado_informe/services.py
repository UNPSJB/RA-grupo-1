from typing import List, Optional
from sqlalchemy.orm import Session
from src.resultado_informe import schemas, models


def _crear_respuesta_db(
    *,
    pregunta_id: int,
    texto_respuesta: Optional[str],
    asignatura_id: int,
    informe_catedra_finalizado_id: Optional[int] = None,
) -> models.ResultadoInforme:
    return models.ResultadoInforme(
        informe_catedra_finalizado_id=informe_catedra_finalizado_id,
        pregunta_id=pregunta_id,
        texto_respuesta=texto_respuesta or "",
        asignatura_id=asignatura_id,
    )


#tendria que funcionar el guardar respuesta  para informe catedra
def guardar_respuesta(db: Session, respuesta: schemas.RespuestaInformeCreate) -> models.ResultadoInforme:  
    respuesta_db = _crear_respuesta_db(
        informe_catedra_finalizado_id=respuesta.informe_catedra_finalizado_id,
        pregunta_id=respuesta.pregunta_id,
        texto_respuesta=respuesta.texto_respuesta,
        asignatura_id=respuesta.asignatura_id,
    )
    db.add(respuesta_db)
    db.commit()
    db.refresh(respuesta_db)
    return respuesta_db


def guardar_respuestas_lote(
    db: Session,
    respuestas: List[schemas.RespuestaInformeCreate],
) -> List[models.ResultadoInforme]:
    respuestas_db: List[models.ResultadoInforme] = []

    for respuesta_data in respuestas:
        respuesta_db = _crear_respuesta_db(
            informe_catedra_finalizado_id=respuesta_data.informe_catedra_finalizado_id,
            pregunta_id=respuesta_data.pregunta_id,
            texto_respuesta=respuesta_data.texto_respuesta,
            asignatura_id=respuesta_data.asignatura_id,
        )
        db.add(respuesta_db)
        respuestas_db.append(respuesta_db)

    db.commit()

    for respuesta_db in respuestas_db:
        db.refresh(respuesta_db)

    return respuestas_db


# nuevo para el informe sintentico 
def guardar_respuestas_lote_sintetico(
    db: Session,
    respuestas: List[schemas.RespuestaInformeSinteticoCreate],
) -> List[models.ResultadoInforme]:
    respuestas_db: List[models.ResultadoInforme] = []

    for respuesta_data in respuestas:
        respuesta_db = _crear_respuesta_db(
            informe_catedra_finalizado_id=None,
            pregunta_id=respuesta_data.pregunta_id,
            texto_respuesta=respuesta_data.texto_respuesta,
            asignatura_id=respuesta_data.informe_sintetico_finalizado_id,
        )
        db.add(respuesta_db)
        respuestas_db.append(respuesta_db)

    db.commit()

    for respuesta_db in respuestas_db:
        db.refresh(respuesta_db)

    return respuestas_db
