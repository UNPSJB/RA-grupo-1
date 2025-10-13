from sqlalchemy import select, update
from sqlalchemy.orm import Session
from collections import Counter
from typing import List, Dict
from src.materias import schemas
from src.materias.models import Materia as MateriaModel
from src.respuestas.models import Respuesta as RespuestaModel, OpcionRespuesta
from src.encuestas.models import Encuesta as EncuestaModel
from datetime import datetime


def listar_materias(db: Session) -> List[schemas.Materia]:
    return db.scalars(select(MateriaModel)).all()

def crear_materia(db: Session, materia: schemas.MateriaCreate) -> schemas.Materia:
    _materia = MateriaModel(**materia.model_dump())
    db.add(_materia)
    db.commit()
    db.refresh(_materia)
    return _materia

def leer_materia(db: Session, materia_id: int) -> schemas.Materia:
    return db.scalar(select(MateriaModel).where(MateriaModel.id == materia_id))

def modificar_materia(
    db: Session, materia_id: int, materia: schemas.MateriaUpdate) -> schemas.Materia:
    db_materia = leer_materia(db, materia_id)
    db.execute(update(MateriaModel).where(MateriaModel.id == materia_id).values(**materia.model_dump()))
    db.commit()
    db.refresh(db_materia)
    return db_materia


def eliminar_materia(db: Session, materia_id: int) -> dict:
    db_materia = leer_materia(db, materia_id)
    db.delete(db_materia)
    db.commit()
    return {"message": f"Materia {materia_id} eliminada"}


def distribuir_resp_materia(
    db: Session, materia_id: int, pregunta_id: int) -> Dict[str, List[int]]:
    año_actual = datetime.now().year

    rows = db.scalars(
        select(RespuestaModel.valor_numerico)
        .join(EncuestaModel, RespuestaModel.encuesta_id == EncuestaModel.id)
        .where(
            EncuestaModel.asignatura == materia_id,
            EncuestaModel.año == año_actual,
            RespuestaModel.pregunta_id == pregunta_id,
            RespuestaModel.opcion == OpcionRespuesta.respCategorica,
            RespuestaModel.valor_numerico.is_not(None),
        )
    ).all()

    counter = Counter(int(v) for v in rows if 1 <= int(v) <= 3)
    labels = [1, 2, 3]
    data = [counter.get(k, 0) for k in labels]
    return {"labels": labels, "data": data}
