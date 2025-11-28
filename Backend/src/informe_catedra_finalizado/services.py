from typing import List, Optional
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select, func
from src.informe_catedra_finalizado import schemas, models, exceptions
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.asignaturas.models import Asignatura
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.vinculaciones.models import Duracion
from src.resultado_informe import services as respuestas_services
from src.resultado_informe.models import ResultadoInforme 
from src.preguntas.models import Pregunta
from src.encuesta_finalizada.models import EncuestaFinalizada 
from src.vinculaciones.models import asignatura_carrera
from src.respuestas_informe.models import RespuestaInforme
from src.departamentos.models import Departamento

def obtener_informes_pendientes(db: Session, docente_id: int,anio: int,duracion: Duracion) -> List[dict]:
    relaciones = db.scalars(
        select(AsignaturaDocente)
        .options(joinedload(AsignaturaDocente.asignatura))
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
            .where(InformeCatedraFinalizado.asignatura_docente_id == relacion.id)
        )

        if not existe:
            pendientes.append({
                "asignatura_id": relacion.asignatura.id,
                "asignatura_nombre": relacion.asignatura.nombre,
                "asignatura_docente_id": relacion.id
            })
    
    return pendientes


def obtener_informes_finalizados_docente(db: Session, docente_id: int) -> List[models.InformeCatedraFinalizado]:
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .where(
            AsignaturaDocente.docente_id == docente_id)
        ).all()

    return informes


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
        JTP=informe_data.JTP,
        aux_primera=informe_data.aux_primera,
        aux_segunda=informe_data.aux_segunda
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
        select(InformeCatedraFinalizado)
        .where(InformeCatedraFinalizado.id == informe_id)
        .options(
            selectinload(InformeCatedraFinalizado.resultado_informe)
                .selectinload(ResultadoInforme.pregunta),
        )
    )
    informe = db.scalar(stmt)
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()
    return informe

def obtener_informes_por_departamento(db: Session, departamento_id: int) -> List[models.InformeCatedraFinalizado]:
    informes = db.scalars(
        select(InformeCatedraFinalizado)
        .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente_id == AsignaturaDocente.id)
        .join(Asignatura, AsignaturaDocente.asignatura_id == Asignatura.id)
        .where(Asignatura.departamento_id == departamento_id)
    ).all()
    return informes

def obtener_informe_finalizado_detalle(db: Session, informe_id: int) -> dict:
    stmt = (
        select(models.InformeCatedraFinalizado)
        .where(models.InformeCatedraFinalizado.id == informe_id)
        .options(
            selectinload(models.InformeCatedraFinalizado.respuestas_informe)
            .selectinload(RespuestaInforme.pregunta),
            joinedload(models.InformeCatedraFinalizado.asignatura_docente) 
                .joinedload(AsignaturaDocente.asignatura)
                .joinedload(Asignatura.departamento)
                .joinedload(Departamento.sede),
            joinedload(models.InformeCatedraFinalizado.asignatura_docente)
                .joinedload(AsignaturaDocente.docente)
        )
    )
    
    informe = db.scalar(stmt)
    if not informe:
        raise exceptions.InformeFinalizadoNoEncontrado()
    
    informe_dict = {
        "id": informe.id,
        "asignatura_docente_id": informe.asignatura_docente_id,
        "informe_catedra_id": informe.informe_catedra_id,
        "titulo": informe.titulo,
        "contenido": informe.contenido,
        "cantidadAlumnos": informe.cantidadAlumnos,
        "anio": informe.anio,
        "duracion": informe.duracion,
        "cantidadComisionesTeoricas": informe.cantidadComisionesTeoricas,
        "cantidadComisionesPracticas": informe.cantidadComisionesPracticas,
        "respuestas_informe": informe.respuestas_informe,
        "JTP": informe.JTP,
        "aux_primera": informe.aux_primera,
        "aux_segunda": informe.aux_segunda,
        
        "asignaturaId": -1, 
        "asignaturaNombre": None,
        "asignaturaCodigo": None,
        "docenteResponsable": None,
        "sede": "Sin asignar"  
    }

    if informe.asignatura_docente:
        if informe.asignatura_docente.asignatura:
            informe_dict["asignaturaId"] = informe.asignatura_docente.asignatura.id
            informe_dict["asignaturaNombre"] = informe.asignatura_docente.asignatura.nombre
            informe_dict["asignaturaCodigo"] = informe.asignatura_docente.asignatura.matricula

            try:
                asignatura = informe.asignatura_docente.asignatura
                if asignatura.departamento and asignatura.departamento.sede:
                    informe_dict["sede"] = asignatura.departamento.sede.nombre
            except AttributeError:
                pass
        
        if informe.asignatura_docente.docente:
            docente = informe.asignatura_docente.docente
            informe_dict["docenteResponsable"] = f"{docente.nombre} {docente.apellido}"

    return informe_dict


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

    update_data = data.model_dump(exclude_unset=True, exclude={"respuestas"})
    for campo, valor in update_data.items():
        setattr(informe, campo, valor)

    ad = db.scalar(
        select(AsignaturaDocente).where(AsignaturaDocente.id == informe.asignatura_docente_id)
    )
    asignatura_id = ad.asignatura_id


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

def get_progreso_departamento( db: Session, departamento_id: int, anio: int,  duracion: Duracion,carrera_id: Optional[int] = None ):
    stmt_base = (
        select(AsignaturaDocente.id)
        .join(Asignatura)
        .where(
            Asignatura.departamento_id == departamento_id,
            AsignaturaDocente.anio == anio,
            AsignaturaDocente.duracion == duracion
        )
    )

    if carrera_id is not None:
        stmt_base = stmt_base.join(
            asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id
        ).where(asignatura_carrera.c.carrera_id == carrera_id)

    asignatura_docente_ids = db.scalars(stmt_base).all()

    if not asignatura_docente_ids:
        return {"completados": 0, "pendientes": 0}

    total_asignaturas_esperadas = len(asignatura_docente_ids)

    completados = db.scalar(
        select(func.count(InformeCatedraFinalizado.id))
        .where(
            InformeCatedraFinalizado.docente_materia_id.in_(asignatura_docente_ids)
        )
        .where(InformeCatedraFinalizado.anio == anio)
        .where(InformeCatedraFinalizado.duracion == duracion)
    )
    
    completados_count = completados if completados else 0
    pendientes = total_asignaturas_esperadas - completados_count

    return {"completados": completados_count, "pendientes": pendientes}

def obtener_informes_pendientes_por_departamento( db: Session, departamento_id: int, anio: int, duracion: Duracion, carrera_id: Optional[int] = None ) -> List[dict]:
    stmt = (
        select(AsignaturaDocente)
        .join(Asignatura)
        .where(
            Asignatura.departamento_id == departamento_id,
            AsignaturaDocente.anio == anio,
            AsignaturaDocente.duracion == duracion
        )
        .options(
            joinedload(AsignaturaDocente.duracion),
            joinedload(AsignaturaDocente.docente)
        )
    )

    if carrera_id is not None:
        stmt = stmt.join(
            asignatura_carrera,
            Asignatura.id == asignatura_carrera.c.asignatura_id
        )
        
        stmt = stmt.where(asignatura_carrera.c.carrera_id == carrera_id)

    relaciones_depto = db.scalars(stmt).unique().all()

    if not relaciones_depto:
        return []

    ids_relaciones = [r.id for r in relaciones_depto]
    
    informes_completados_ids = db.scalars(
        select(InformeCatedraFinalizado.asignatura_docente_id)
        .where(InformeCatedraFinalizado.docente_materia_id.in_(ids_relaciones))
        .where(InformeCatedraFinalizado.anio == anio)
        .where(InformeCatedraFinalizado.duracion == duracion)
    ).all()
    
    set_completados = set(informes_completados_ids)
    pendientes = []
    for relacion in relaciones_depto:
        if relacion.id not in set_completados:
            docente_nombre = "No asignado"
            if relacion.docente:
                docente_nombre = f"{relacion.docente.nombre} {relacion.docente.apellido}"

            pendientes.append({
                "asignatura": relacion.asignatura.nombre,
                "docente_responsable": docente_nombre
            })
            
    return pendientes

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
