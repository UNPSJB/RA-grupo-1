from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from src.informe_catedra import models, schemas, exceptions
from src.categorias.models import Categoria
from src.preguntas.models import Pregunta

def crear_informe_catedra(db: Session, informe: schemas.InformeCatedraCreate):
    db_informe = models.InformeCatedra(
        titulo=informe.titulo,
        asignatura_id=informe.asignatura_id
    )
    db.add(db_informe)
    db.flush()
    db.commit()
    db.refresh(db_informe)
    return db_informe


def get_informe_catedra(db: Session, informe_id: int):
    informe = db.query(models.InformeCatedra).filter_by(id=informe_id).first()
    if not informe:
        raise exceptions.InformeNoEncontrado()
    return informe


def get_informes_catedra(db: Session):
    return db.query(models.InformeCatedra).all()


def get_categorias_con_preguntas_por_informe(db: Session, informe_id: int):
    _ = get_informe_catedra(db, informe_id)  

    stmt = (
        select(Categoria)
        .options(
            selectinload(Categoria.preguntas).selectinload(Pregunta.opciones)
        )
        .where(Categoria.informe_catedra_id == informe_id)
    )

    return db.scalars(stmt).unique().all()
