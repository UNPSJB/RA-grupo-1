from sqlalchemy import select
from sqlalchemy.orm import Session
from src.periodos_apertura.models import PeriodoApertura
from src.periodos_apertura import schemas, exceptions
from src.vinculaciones.models import Duracion

def crear_periodo_apertura(db: Session, apertura: schemas.PeriodoAperturaCreate) -> schemas.PeriodoApertura:
    _periodo_apertura = PeriodoApertura(**apertura.model_dump())
    db.add(_periodo_apertura)
    db.commit()
    db.refresh(_periodo_apertura)
    return _periodo_apertura

def leer_periodo_apertura(db: Session, anio: int, duracion: Duracion) -> schemas.PeriodoApertura:
    db_periodo_apertura = db.scalar(select(PeriodoApertura)
                            .where(PeriodoApertura.anio == anio)
                            .where(PeriodoApertura.duracion == duracion))
    if db_periodo_apertura is None:
        raise exceptions.PeriodoAperturaNoEncontrado()
    return db_periodo_apertura 

def leer_fechas_encuesta(db: Session, anio: int, duracion: Duracion) -> schemas.PeriodoEncuesta:
    db_periodo_apertura : schemas.PeriodoEncuesta = db.scalar(select(PeriodoApertura)
                            .where(PeriodoApertura.anio == anio)
                            .where(PeriodoApertura.duracion == duracion))
    if db_periodo_apertura is None:
        raise exceptions.PeriodoAperturaNoEncontrado()
    periodo_encuesta= schemas.PeriodoEncuesta(
        inicio_encuesta=db_periodo_apertura.inicio_encuesta,
        fin_encuesta=db_periodo_apertura.fin_encuesta
    )
    return periodo_encuesta

def leer_fechas_informe_catedra(db: Session, anio: int, duracion: Duracion) -> schemas.PeriodoInformeCatedra:
    db_periodo_apertura : schemas.PeriodoApertura = db.scalar(select(PeriodoApertura)
                            .where(PeriodoApertura.anio == anio)
                            .where(PeriodoApertura.duracion == duracion))
    if db_periodo_apertura is None:
        raise exceptions.PeriodoAperturaNoEncontrado()
    periodo_informe= schemas.PeriodoInformeCatedra(
        inicio_informe_catedra=db_periodo_apertura.inicio_informe_catedra,
        fin_informe_catedra=db_periodo_apertura.fin_informe_catedra
    )
    return periodo_informe

def leer_fechas_informe_sintetico(db: Session, anio: int, duracion: Duracion) -> schemas.PeriodoInformeSintetico:
    db_periodo_apertura : schemas.PeriodoApertura = db.scalar(select(PeriodoApertura)
                            .where(PeriodoApertura.anio == anio)
                            .where(PeriodoApertura.duracion == duracion))
    if db_periodo_apertura is None:
        raise exceptions.PeriodoAperturaNoEncontrado()
    periodo_informe= schemas.PeriodoInformeSintetico(
        inicio_informe_sintetico=db_periodo_apertura.inicio_informe_sintetico,
        fin_informe_sintetico=db_periodo_apertura.fin_informe_sintetico
    )
    return periodo_informe