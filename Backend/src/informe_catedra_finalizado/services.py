from typing import List
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select
from src.informe_catedra_finalizado import schemas, models, exceptions
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.asignaturas.models import Asignatura
from src.asignaturas.services import leer_asignatura
from src.docentes.services import leer_docente
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.vinculaciones.models import Duracion
from src.resultado_informe import services as respuestas_services
from src.resultado_informe.models import ResultadoInforme  
from src.respuestas_informe.models import RespuestaInforme
from src.preguntas.models import Pregunta

def obtener_informes_pendientes(db: Session, docente_id: int, anio: int, duracion: Duracion):

    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .where(
            AsignaturaDocente.docente_id == docente_id,
            InformeCatedraFinalizado.anio == anio,
            InformeCatedraFinalizado.duracion == duracion,
            InformeCatedraFinalizado.estado == "pendiente"
        )
        .options(
            selectinload(InformeCatedraFinalizado.resultado_informe)
                .selectinload(ResultadoInforme.pregunta)
        )
    ).all()

    return [mapear_informe_detalle(db, i) for i in informes]


def obtener_informes_finalizados_docente(db: Session, docente_id: int):

    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .where(
            AsignaturaDocente.docente_id == docente_id,
            InformeCatedraFinalizado.estado == "finalizado"
        )
        .options(
            selectinload(InformeCatedraFinalizado.resultado_informe)
                .selectinload(ResultadoInforme.pregunta)
        )
    ).all()

    return [mapear_informe_detalle(db, i) for i in informes]


def verificar_informe_existente(db: Session, asignatura_docente_id: int) -> bool:
    informe = db.scalar(
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.asignatura_docente_id == asignatura_docente_id)
    )
    return informe is not None


def crear_informe_finalizado(db: Session, informe_data: schemas.InformeCatedraFinalizadoCreate) -> models.InformeCatedraFinalizado:
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
        .where(InformeCatedraFinalizado.asignatura_docente_id == informe_data.asignatura_docente_id)
    )
    if existe:
        raise exceptions.InformeFinzalizadoYaExiste()
    

    informe_db = InformeCatedraFinalizado(**informe_data.model_dump())
    db.add(informe_db)
    db.commit()  
    db.refresh(informe_db) 
    ''' 
    respuestas_con_id = []
    if informe_data.respuestas:
        for respuesta in informe_data.respuestas:
            respuesta_data = respuestas_services.schemas.RespuestaInformeCreate(
                **respuesta.model_dump(),
                informe_catedra_finalizado_id=informe_db.id 
            )
            respuestas_con_id.append(respuesta_data)
        respuestas_services.guardar_respuestas_lote(db, respuestas_con_id)
    '''
    return obtener_informe_finalizado(db, informe_db.id)


def obtener_informe_finalizado(db: Session, informe_id: int):
    stmt = (
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.id == informe_id)
        .options(
            selectinload(InformeCatedraFinalizado.resultado_informe)
                .selectinload(ResultadoInforme.pregunta),
            selectinload(InformeCatedraFinalizado.respuestas_informe)
                .selectinload(RespuestaInforme.pregunta)
        )
    )
    informe = db.scalar(stmt)
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()

    return mapear_informe_detalle(db, informe)

def obtener_informes_por_departamento(db: Session, departamento_id: int) -> List[models.InformeCatedraFinalizado]:
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .join(Asignatura, AsignaturaDocente.asignatura_id == Asignatura.id)
        .where(Asignatura.departamento_id == departamento_id)
    ).all()
    return informes

def mapear_informe_detalle(db: Session, informe: InformeCatedraFinalizado) -> schemas.InformeCatedraFinalizadoDetalle:
    
    asi_doc = db.scalar(
        select(AsignaturaDocente).where(AsignaturaDocente.id == informe.asignatura_docente_id)
    )
    asignatura = leer_asignatura(db, asi_doc.asignatura_id)
    docente = leer_docente(db, asi_doc.docente_id)

    informe_detalle = schemas.InformeCatedraFinalizadoDetalle(
        id=informe.id,
        asignatura_docente_id=informe.asignatura_docente_id,
        informe_catedra_id=informe.informe_catedra_id,
        titulo=informe.titulo,
        contenido=informe.contenido,
        cantidadAlumnos=informe.cantidadAlumnos,
        anio=informe.anio,
        duracion=informe.duracion,
        cantidadComisionesTeoricas=informe.cantidadComisionesTeoricas,
        cantidadComisionesPracticas=informe.cantidadComisionesPracticas,
        JTP=informe.JTP,
        aux_primera=informe.aux_primera,
        aux_segunda=informe.aux_segunda,
        estado=informe.estado,
        resultado_informe=informe.resultado_informe,
        respuestas_informe=informe.respuestas_informe,
        asignaturaId=asignatura.id,
        asignaturaNombre=asignatura.nombre,
        asignaturaCodigo=asignatura.matricula,
        docenteResponsable=f"{docente.persona.nombre} {docente.persona.apellido}"
    )

    return informe_detalle

def actualizar_informe_finalizado(db: Session, informe_id: int, data: schemas.InformeCatedraFinalizadoUpdate) -> schemas.InformeCatedraFinalizadoDetalle:
    #traigo informe con respuestas
    informe = db.scalar(
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.id == informe_id)
        .options(
            selectinload(InformeCatedraFinalizado.respuestas_informe),
            selectinload(InformeCatedraFinalizado.resultado_informe)
                .selectinload(ResultadoInforme.pregunta),
        )
    )
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()

    #actualiza la cabecera del informe
    update_data = data.model_dump(exclude_unset=True, exclude={"respuestas"})
    for campo, valor in update_data.items():
        setattr(informe, campo, valor)

    ad = db.scalar(
        select(AsignaturaDocente).where(AsignaturaDocente.id == informe.asignatura_docente_id)
    )
    asignatura_id = ad.asignatura_id

    #respuestas existentes
    existentes = db.scalars(
        select(RespuestaInforme).where(
            RespuestaInforme.informe_catedra_finalizado_id == informe.id
        )
    ).all()

    existentes_por_pregunta = {r.pregunta_id: r for r in existentes}

    for r_in in data.respuestas:
        existente = existentes_por_pregunta.get(r_in.pregunta_id)

        texto = r_in.texto_respuesta
        opcion_id = r_in.opcion_id

        #si existe la actualizo, sino creo nueva
        if existente:
            existente.texto_respuesta = texto
            existente.opcion_id = opcion_id
        else:

            nueva = RespuestaInforme(
                informe_catedra_finalizado_id=informe.id,
                pregunta_id=r_in.pregunta_id,
                opcion_id=opcion_id,
                texto_respuesta=texto,
                asignatura_id=asignatura_id,
            )
            db.add(nueva)

    db.add(informe)
    db.commit()
    db.refresh(informe)

    #devuelve el informe actualizado con sus respuestas
    informe = db.scalar(
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.id == informe_id)
        .options(
            selectinload(InformeCatedraFinalizado.respuestas_informe)
                .selectinload(RespuestaInforme.pregunta),
            selectinload(InformeCatedraFinalizado.resultado_informe)
                .selectinload(ResultadoInforme.pregunta),
        )
    )

    return mapear_informe_detalle(db, informe)

def obtener_informes_pendientes_cabecera(db: Session, docente_id: int):
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .join(Asignatura, AsignaturaDocente.asignatura_id == Asignatura.id)
        .where(
            AsignaturaDocente.docente_id == docente_id,
            InformeCatedraFinalizado.estado == "pendiente"
        )
    ).all()

    resultado = []
    for inf in informes:
        asignatura = inf.asignatura_docente.asignatura
        resultado.append(
            schemas.InformeCatedraCabecera(
                id=inf.id,
                asignatura_docente_id=inf.asignatura_docente_id,
                informe_catedra_id=inf.informe_catedra_id,
                titulo=inf.titulo,
                anio=inf.anio,
                duracion=inf.duracion,
                estado=inf.estado,
                asignaturaNombre=asignatura.nombre,
                asignaturaCodigo=asignatura.matricula,
            )
        )
    return resultado

def guardar_respuestas_informe(db: Session, informe_id: int, respuestas: List[schemas.RespuestaInformeBase]):
    informe = db.scalar(
        select(InformeCatedraFinalizado).where(InformeCatedraFinalizado.id == informe_id)
    )
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()

    rel = db.query(AsignaturaDocente).filter(
        AsignaturaDocente.id == informe.asignatura_docente_id
    ).first()

    asignatura_id = rel.asignatura_id

    db.query(RespuestaInforme).filter(
        RespuestaInforme.informe_catedra_finalizado_id == informe_id
    ).delete()
    respuestas_db = []
    for r in respuestas:
        resp = RespuestaInforme(
            informe_catedra_finalizado_id=informe_id,
            pregunta_id=r.pregunta_id,
            opcion_id=r.opcion_id,
            texto_respuesta=r.texto_respuesta,
            asignatura_id=asignatura_id
        )
        db.add(resp)
        respuestas_db.append(resp)

    db.commit()
    return respuestas_db

def guardar_borrador(db: Session, informe_id: int, payload: schemas.BorradorUpdate):
    informe = db.get(InformeCatedraFinalizado, informe_id)
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()

    asi_doc = db.scalar(
        select(AsignaturaDocente).where(AsignaturaDocente.id == informe.asignatura_docente_id)
    )
    
    for r in payload.respuestas:
        existente = db.scalar(
            select(RespuestaInforme).where(
                RespuestaInforme.informe_catedra_finalizado_id == informe_id,
                RespuestaInforme.pregunta_id == r.pregunta_id
            )
        )

        if existente:
            existente.texto_respuesta = r.texto_respuesta
            existente.opcion_id = r.opcion_id
        else:
            nuevo = RespuestaInforme(
                informe_catedra_finalizado_id=informe_id,
                pregunta_id=r.pregunta_id,
                opcion_id=r.opcion_id,
                texto_respuesta=r.texto_respuesta,
                asignatura_id=asi_doc.asignatura_id
            )
            db.add(nuevo)

    return informe_dict

def get_informes_pendientes_por_departamento(db: Session, departamento_id: int):
    from src.docentes.models import Docente
    from src.asignaturas.models import Asignatura

    # docentes del departamento → asignaturas del depto → informes pendientes
    subquery_asignaturas = (
        select(Asignatura.id)
        .where(Asignatura.departamento_id == departamento_id)
        .subquery()
    )

    pendientes = (
        db.query(InformeCatedraFinalizado)
        .filter(
            InformeCatedraFinalizado.asignatura_id.in_(subquery_asignaturas),
            InformeCatedraFinalizado.estado == "pendiente"
        )
        .all()
    )

    return pendientes
    db.commit()
    return {"ok": True}

def finalizar_informe(db: Session, informe_id: int):
    informe = db.get(InformeCatedraFinalizado, informe_id)
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()

    informe.estado = "finalizado"
    db.commit()
    db.refresh(informe)

    return {"ok": True}

def obtener_informes_finalizados_cabecera(db: Session, docente_id: int):
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .join(Asignatura, AsignaturaDocente.asignatura_id == Asignatura.id)
        .where(
            AsignaturaDocente.docente_id == docente_id,
            InformeCatedraFinalizado.estado == "finalizado"
        )
    ).all()

    resultado = []
    for inf in informes:
        asignatura = inf.asignatura_docente.asignatura
        resultado.append(
            schemas.InformeCatedraCabecera(
                id=inf.id,
                asignatura_docente_id=inf.asignatura_docente_id,
                informe_catedra_id=inf.informe_catedra_id,
                titulo=inf.titulo,
                anio=inf.anio,
                duracion=inf.duracion,
                estado=inf.estado,
                asignaturaNombre=asignatura.nombre,
                asignaturaCodigo=asignatura.matricula,
            )
        )
    return resultado