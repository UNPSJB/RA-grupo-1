from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, update, insert, exists
from sqlalchemy.orm import Session, selectinload, joinedload
from src.encuestas.models import Encuesta, EstadoEncuesta
from src.encuestas import schemas, exceptions
from src.respuestas.schemas import RespuestaCreate
from src.respuestas.models import Respuesta
from src.preguntas.models import Pregunta
from src.categorias.models import Categoria
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.vinculaciones.models import asignatura_alumno, Duracion, alumno_encuesta
from src.asignaturas.models import Asignatura
from src.categorias import schemas as categoria_schemas
from src.preguntas import schemas as pregunta_schemas
from src.encuestas.schemas import EncuestaParaCompletar

def listar_encuestas_activas(db: Session) -> List[schemas.Encuesta]:
    ahora = datetime.utcnow()
    stmt = select(Encuesta).where(
        Encuesta.activa == True,
        Encuesta.estado == EstadoEncuesta.abierta,
        Encuesta.fecha_inicio <= ahora,
        (Encuesta.fecha_fin == None) | (Encuesta.fecha_fin >= ahora)
    ).options(selectinload(Encuesta.asignatura))
    return db.scalars(stmt).all()

def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> schemas.Encuesta:
    if encuesta.fecha_fin and encuesta.fecha_inicio >= encuesta.fecha_fin:
        raise exceptions.FechasEncuestaInvalidas()
    _encuesta = Encuesta(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def leer_encuesta(db: Session, encuesta_id: int, cargar_relaciones: bool = False) -> Encuesta:
    stmt = select(Encuesta).where(Encuesta.id == encuesta_id)
    if cargar_relaciones:
        stmt = stmt.options(
            selectinload(Encuesta.categorias),
            selectinload(Encuesta.preguntas),
            selectinload(Encuesta.asignatura),
        )
    db_encuesta = db.scalar(stmt)
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta

def modificar_encuesta(db: Session, encuesta_id: int, encuesta: schemas.EncuestaUpdate) -> Encuesta:
    db_encuesta = leer_encuesta(db, encuesta_id)
    update_data = encuesta.model_dump(exclude_unset=True)
    if not update_data:
        return db_encuesta
    if 'fecha_inicio' in update_data and 'fecha_fin' in update_data:
        if update_data['fecha_inicio'] and update_data['fecha_fin'] and update_data['fecha_inicio'] >= update_data['fecha_fin']:
            raise exceptions.FechasEncuestaInvalidas()
    db.execute(
        update(Encuesta)
        .where(Encuesta.id == encuesta_id)
        .values(**update_data)
    )
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def eliminar_encuesta(db: Session, encuesta_id: int) -> dict:
    db_encuesta = leer_encuesta(db, encuesta_id)
    
    db.execute(
        update(Encuesta)
        .where(Encuesta.id == encuesta_id)
        .values(activa=False, estado=EstadoEncuesta.cerrada)
    )
    db.commit()
    
    return {"message": f"Encuesta '{db_encuesta.titulo}' desactivada correctamente"}

def listar_categorias_encuesta(db: Session, encuesta_id: int):
    db_encuesta = leer_encuesta(db, encuesta_id, cargar_relaciones=True)
    return db_encuesta.categorias if hasattr(db_encuesta, 'categorias') else []

def listar_preguntas_encuesta(db: Session, encuesta_id: int) -> List[Pregunta]:
    db_encuesta = leer_encuesta(db, encuesta_id, cargar_relaciones=True)
    preguntas = []
    for categoria in db_encuesta.categorias:
        if hasattr(categoria, 'preguntas'):
            preguntas.extend(categoria.preguntas)
    return preguntas

def vincular_alumno_encuesta(db: Session, encuesta_id: int, alumno_id: int) -> schemas.Encuesta:
    # Vincula un alumno a una encuesta
    db_encuesta = leer_encuesta(db, encuesta_id)
    
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def validar_encuesta_activa(db: Session, encuesta_id: int) -> bool:
    # Valida si una encuesta está activa y en período válido
    encuesta = leer_encuesta(db, encuesta_id)
    ahora = datetime.utcnow()
    
    return (
        encuesta.activa and 
        encuesta.estado == EstadoEncuesta.abierta and
        encuesta.fecha_inicio <= ahora <= encuesta.fecha_fin
    )

def responder_encuesta(db: Session, respuesta: RespuestaCreate):
    encuesta = db.query(Encuesta).filter(Encuesta.id == respuesta.encuesta_id).first()
    if not encuesta or not encuesta.activa:
        raise Exception("Encuesta no activa o no encontrada")

    if not (encuesta.fecha_inicio <= datetime.utcnow() <= encuesta.fecha_fin):
        raise Exception("Encuesta fuera de período")

    
    db_respuesta = Respuesta(
        alumno_id=respuesta.alumno_id,
        encuesta_id=respuesta.encuesta_id,
        respuesta_texto=respuesta.respuesta_texto,
        progreso=50  
    )
    db.add(db_respuesta)
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta

def obtener_estadisticas_encuesta(db: Session, encuesta_id: int) -> dict:
    # Obtiene estadísticas de una encuesta
    encuesta = leer_encuesta(db, encuesta_id)
    
    total_alumnos = len(encuesta.alumnos) if hasattr(encuesta, 'alumnos') else 0
    
    return {
        "encuesta_id": encuesta_id,
        "titulo": encuesta.titulo,
        "total_alumnos": total_alumnos,
        "estado": encuesta.estado,
        "activa": encuesta.activa
    }

def listar_preguntas_encuesta(db: Session, encuesta_id: int) -> List[pregunta_schemas.Pregunta]:
    """
    Devuelve todas las preguntas (de todas las categorías) asociadas a una encuesta específica.
    """
    db_encuesta = leer_encuesta(db, encuesta_id)
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    
    preguntas = []
    if hasattr(db_encuesta, 'categorias'):
        for categoria in db_encuesta.categorias:
            if hasattr(categoria, 'preguntas'):
                preguntas.extend(categoria.preguntas)
    
    return preguntas

def obtener_respuestas_por_encuesta(db: Session, encuesta_id: int):
    # devuelve preguntas con sus respuestas agrupadas
    from src.respuestas.models import Respuesta
    from src.preguntas.models import Pregunta
    stmt = (
        select(Respuesta, Pregunta.texto)
        .join(Pregunta, Respuesta.pregunta_id == Pregunta.id)
        .where(Respuesta.encuesta_id == encuesta_id)
    )
    resultados = db.execute(stmt).all()
    preguntas_con_respuestas = []
    for respuesta, pregunta_texto in resultados:
        pregunta_existente = next((p for p in preguntas_con_respuestas if p["pregunta_id"] == respuesta.pregunta_id), None)
        respuesta_data = {
            "id": respuesta.id,
            "alumno_id": respuesta.alumno_id,
            "respuesta_texto": getattr(respuesta, "respuesta_texto", None),
            "opcion_multiple": getattr(respuesta, "opcion_multiple", None),
            "progreso": getattr(respuesta, "progreso", 100)
        }
        if pregunta_existente:
            pregunta_existente["respuestas"].append(respuesta_data)
        else:
            preguntas_con_respuestas.append({
                "pregunta_id": respuesta.pregunta_id,
                "pregunta_texto": pregunta_texto,
                "respuestas": [respuesta_data]
            })
    return preguntas_con_respuestas

def listar_encuestas_para_alumno(db: Session, alumno_id: int):
    """
    Lista las encuestas disponibles para un alumno específico
    """

    from src.asignaturas.models import Asignatura
    from src.vinculaciones.models import asignatura_alumno
    from src.encuesta_finalizada.models import EncuestaFinalizada

    ahora = datetime.utcnow()

    # DEBUG 1: Ver asignaturas del alumno
    asignaturas_alumno = db.scalars(
        select(asignatura_alumno.c.asignatura_id)
        .where(asignatura_alumno.c.alumno_id == alumno_id)
    ).all()
    print(f"DEBUG - Asignaturas del alumno {alumno_id}: {asignaturas_alumno}")
    
    # DEBUG 2: Ver todas las encuestas activas
    todas_encuestas = db.scalars(
        select(Encuesta)
        .where(Encuesta.activa == True)
        .where(Encuesta.estado == EstadoEncuesta.abierta)
        .where(Encuesta.fecha_inicio <= ahora)
        .where(Encuesta.fecha_fin >= ahora)
    ).all()
    print(f"DEBUG - Total encuestas activas: {len(todas_encuestas)}")
    for e in todas_encuestas:
        print(f"  - Encuesta {e.id}: {e.titulo}, Asignatura ID: {e.asignatura_id}")

    # DEBUG 3: Ver encuestas finalizadas por el alumno
    finalizadas = db.scalars(
        select(EncuestaFinalizada.encuesta_id)
        .where(EncuestaFinalizada.alumno_id == alumno_id)
    ).all()
    print(f"DEBUG - Encuestas finalizadas por alumno: {finalizadas}")

    # Subconsulta
    subquery_finalizadas = (
        select(EncuestaFinalizada.encuesta_id)
        .where(EncuestaFinalizada.alumno_id == alumno_id)
    )

    # Consulta principal
    stmt = (
        select(Encuesta)
        .join(Asignatura, Encuesta.asignatura_id == Asignatura.id)
        .join(asignatura_alumno, asignatura_alumno.c.asignatura_id == Asignatura.id)
        .where(asignatura_alumno.c.alumno_id == alumno_id)
        .where(Encuesta.activa == True)
        .where(Encuesta.estado == EstadoEncuesta.abierta)
        .where(Encuesta.fecha_inicio <= ahora)
        .where(Encuesta.fecha_fin >= ahora)
        .where(Encuesta.id.notin_(subquery_finalizadas))
        .options(selectinload(Encuesta.asignatura))
        .distinct()
    )

    encuestas = db.scalars(stmt).all()
    print(f"DEBUG - Encuestas disponibles resultantes: {len(encuestas)}")

    resultado = []
    for encuesta in encuestas:
        docente_nombre = "No asignado"
        if encuesta.asignatura and encuesta.asignatura.docente:
            docente_nombre = f"{encuesta.asignatura.docente.nombre} {encuesta.asignatura.docente.apellido}"
        
        resultado.append(
            schemas.EncuestaAlumnoInfo(
                id=encuesta.id,
                nombre=encuesta.titulo,
                asignatura=encuesta.asignatura.nombre if encuesta.asignatura else "Sin asignatura",
                docente=docente_nombre,
                ciclo_lectivo=f"{encuesta.año}-{encuesta.cursado.value}"
            )
        )
    return resultado

def obtener_encuesta_para_completar(db: Session, encuesta_id: int) -> dict:
    encuesta = leer_encuesta(db, encuesta_id)
    if not (encuesta.activa and encuesta.estado == EstadoEncuesta.abierta):
        raise exceptions.EncuestaNoDisponible()
    asignatura = None
    if encuesta.asignatura_id:
        asignatura = db.scalar(select(Asignatura).where(Asignatura.id == encuesta.asignatura_id))
    if not asignatura and encuesta.asignatura is None:
        raise exceptions.EncuestaNoEncontrada("Asignatura no encontrada")
    docente = None
    if asignatura and getattr(asignatura, "docente", None):
        docente = asignatura.docente
    categorias = db.scalars(select(Categoria).where(Categoria.encuesta_id == encuesta_id).order_by(Categoria.orden)).all()
    categorias_data = []
    for categoria in categorias:
        preguntas = db.scalars(select(Pregunta).where(Pregunta.categoria_id == categoria.id, Pregunta.encuesta_id == encuesta_id).order_by(Pregunta.id)).all()
        preguntas_data = []
        for pregunta in preguntas:
            opciones = [{"id": o.id, "texto": o.contenido} for o in getattr(pregunta, "opciones", [])]
            preguntas_data.append({
                "id": pregunta.id,
                "texto": pregunta.texto,
                "tipo": pregunta.tipo,
                "opciones": opciones
            })
        categorias_data.append({
            "id": categoria.id,
            "codigo": categoria.codigo,
            "nombre": categoria.nombre,
            "orden": categoria.orden,
            "preguntas": preguntas_data
        })
    return {
        "id": encuesta.id,
        "titulo": encuesta.titulo,
        "asignatura": asignatura.nombre if asignatura else getattr(encuesta.asignatura, "nombre", "Sin asignatura"),
        "codigo_asignatura": getattr(asignatura, "matricula", getattr(encuesta.asignatura, "matricula", None)),
        "docente": f"{docente.nombre} {docente.apellido}" if docente else "No asignado",
        "ciclo_lectivo": f"{encuesta.año}",
        "carrera": encuesta.carrera,
        "fecha_inicio": encuesta.fecha_inicio.isoformat() if encuesta.fecha_inicio else None,
        "fecha_fin": encuesta.fecha_fin.isoformat() if encuesta.fecha_fin else None,
        "categorias": categorias_data
    }


def guardar_respuestas_encuesta(db: Session, respuestas_data: schemas.RespuestaEncuesta):
    encuesta = leer_encuesta(db, respuestas_data.encuesta_id)
    ahora = datetime.utcnow()
    if not (encuesta.activa and encuesta.estado == EstadoEncuesta.abierta and encuesta.fecha_inicio <= ahora <= (encuesta.fecha_fin or ahora)):
        raise exceptions.EncuestaNoDisponible()
    existe = db.scalar(
        select(EncuestaFinalizada)
        .where(EncuestaFinalizada.encuesta_id == respuestas_data.encuesta_id)
        .where(EncuestaFinalizada.alumno_id == respuestas_data.alumno_id)
    )
    if existe:
        raise exceptions.EncuestaYaRespondida()
    encuesta_finalizada = EncuestaFinalizada(
        alumno_id=respuestas_data.alumno_id,
        encuesta_id=respuestas_data.encuesta_id,
        asignatura_id=encuesta.asignatura_id or None,
        fecha_finalizada=ahora,
        anio=encuesta.año,
        duracion=encuesta.cursado
    )
    db.add(encuesta_finalizada)
    db.flush()  
    try:
        from src.respuestas import services as respuestas_services
        respuestas_services.crear_respuestas_lote(db, encuesta_finalizada.id, respuestas_data.respuestas)
    except Exception:
        for r in respuestas_data.respuestas:
            db_respuesta = Respuesta(
                encuesta_finalizada_id=encuesta_finalizada.id,
                pregunta_id=r.pregunta_id,
                opcion_id=getattr(r, "opcion_id", None),
                texto_respuesta=getattr(r, "texto", None),
                alumno_id=respuestas_data.alumno_id,
                encuesta_id=respuestas_data.encuesta_id,
            )
            db.add(db_respuesta)
    db.commit()
    return {"message": "Encuesta finalizada exitosamente"}