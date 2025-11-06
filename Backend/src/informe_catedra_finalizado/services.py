from typing import List
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select
from src.informe_catedra_finalizado import schemas, models, exceptions
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.asignaturas.models import Asignatura
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.vinculaciones.models import Duracion
from src.resultado_informe import services as respuestas_services
from src.resultado_informe.models import ResultadoInforme  
from src.preguntas.models import Pregunta

def obtener_informes_pendientes(db: Session, docente_id: int,anio: int,duracion: Duracion) -> List[dict]:
    relaciones = db.scalars(
        select(AsignaturaDocente)
        .options(joinedload(AsignaturaDocente.docente))
        .where(
            AsignaturaDocente.docente_id == docente_id,
            AsignaturaDocente.anio == anio,
            AsignaturaDocente.duracion == duracion
        )
    ).all()
    
    pendientes = []
    
    for relacion in relaciones:
        existe = db.scalar(
            select(InformeCatedraFinalizado)
            .where(InformeCatedraFinalizado.docente_docente_id == relacion.id)
        )

        if not existe:
            pendientes.append({
                "docente_id": relacion.docente.id,
                "docente_nombre": relacion.docente.nombre,
                "asignatura_docente_id": relacion.id
            })
    
    return pendientes

def obtener_informes_finalizados_docente(db: Session, docente_id: int) -> List[models.InformeCatedraFinalizado]:
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .where(AsignaturaDocente.docente_id == docente_id)
    ).all()
    return informes

def verificar_informe_existente(db: Session, asignatura_docente_id: int) -> bool:
    informe = db.scalar(
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.asignatura_docente_id == asignatura_docente_id)
    )
    return informe is not None


def crear_informe_finalizado(db: Session, informe_data: schemas.InformeCatedraFinalizadoConRespuestasCreate) -> models.InformeCatedraFinalizado:
    relacion = db.scalar(
        select(AsignaturaDocente)
        .where(AsignaturaDocente.id == informe_data.asignatura_docente_id)
    )
    if not relacion:
        raise exceptions.DocenteAsignaturaNoEncontrada()
    
    if informe_data.contenido and not informe_data.contenido.strip():
        raise exceptions.InformeContenidoInvalido()
    
    existe = db.scalar(
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.docente_asignatura_id == informe_data.docente_asignatura_id)
    )
    if existe:
        raise exceptions.InformeFinzalizadoYaExiste()
    

    informe_db = models.InformeCatedraFinalizado(
        asignatura_docente_id=informe_data.asignatura_docente_id,
        informe_catedra_id=informe_data.informe_catedra_id,
        titulo=informe_data.titulo,
        cantidadAlumnos=informe_data.cantidadAlumnos,
        contenido=informe_data.contenido,
        anio=informe_data.anio,
        duracion=informe_data.duracion,
        cantidadComisionesTeoricas=informe_data.cantidadComisionesTeoricas,
        cantidadComisionesPracticas=informe_data.cantidadComisionesPracticas,
    )
    db.add(informe_db)
    db.commit()  
    db.refresh(informe_db) 
        
    respuestas_con_id = []
    if informe_data.respuestas:
        for respuesta in informe_data.respuestas:
            respuesta_data = respuestas_services.schemas.RespuestaInformeCreate(
                **respuesta.model_dump(),
                informe_catedra_finalizado_id=informe_db.id 
            )
            respuestas_con_id.append(respuesta_data)
        respuestas_services.guardar_respuestas_lote(db, respuestas_con_id)
    return obtener_informe_finalizado(db, informe_db.id)


def obtener_informe_finalizado(db: Session, informe_id: int) -> models.InformeCatedraFinalizado:
    stmt = (
        select(models.InformeCatedraFinalizado)
        .where(models.InformeCatedraFinalizado.id == informe_id)
        .options(
            selectinload(models.InformeCatedraFinalizado.respuestas_informe)
            .selectinload(ResultadoInforme.pregunta)  
        )
    )
    
    informe = db.scalar(stmt)
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()
    return informe

def obtener_informes_por_departamento(db: Session, departamento_id: int) -> List[models.InformeCatedraFinalizado]:
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.docente_asignatura_id == AsignaturaDocente.id)
        .join(Asignatura, AsignaturaDocente.asignatura_id == Asignatura.id)
        .where(Asignatura.departamento_id == departamento_id)
    ).all()
    return informes