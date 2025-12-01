from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from src.informe_catedra import models, schemas, exceptions
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.asignaturas.models import Asignatura
from src.categorias.models import Categoria
from src.preguntas.models import Pregunta

 # Crea un único InformeCatedra
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
    informe = db.query(models.InformeCatedra).filter(models.InformeCatedra.id == informe_id).first()
    if informe is None:
        raise exceptions.InformeNoEncontrado()
    return informe

def get_informes_catedra(db: Session):
    return db.query(models.InformeCatedra).all()

def get_informes_catedra_finalizados(db: Session, informe_id: int):
    informe = db.query(models.InformeCatedra).filter(models.InformeCatedra.id == informe_id).first()
    if not informe:
        raise exceptions.InformeNoEncontrado()
    informes_por_asignaturas = []
    for asignatura in informe.asignaturas:
        informe_finalizado = db.query(InformeCatedraFinalizado).filter_by(
            asignatura_id=asignatura.id,
            informe_catedra_id=informe.id
        ).first()
        if informe_finalizado:
            informes_por_asignaturas.append(informe_finalizado)
    return informes_por_asignaturas

def get_categorias_con_preguntas_por_informe(db: Session, informe_id: int):

    informe = get_informe_catedra(db, informe_id) 

    stmt = (
        select(Categoria)
        .options(
            selectinload(Categoria.preguntas)
            .selectinload(Pregunta.opciones)
        )
        .where(Categoria.informe_catedra_id == informe_id) 
    )

    categorias_con_preguntas = db.scalars(stmt).unique().all()
    
    return categorias_con_preguntas