from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, update, join
from sqlalchemy.orm import Session, selectinload
from src.encuestas.models import Encuesta, EstadoEncuesta
from src.encuestas import schemas, exceptions
from src.respuestas.schemas import RespuestaCreate
from src.respuestas.models import Respuesta
from src.preguntas.models import Pregunta
from src.categorias import schemas as categoria_schemas
from src.categorias.models import Categoria
from src.preguntas import schemas as pregunta_schemas
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.encuestas.schemas import EncuestaParaCompletar
from src.asignaturas.models import Asignatura 

def listar_encuestas_activas(db: Session) -> List[schemas.Encuesta]:
    # Obtiene solo encuestas activas
    stmt = select(Encuesta).where(
        Encuesta.activa == True,
        Encuesta.estado == EstadoEncuesta.abierta,
        Encuesta.fecha_inicio <= datetime.utcnow(),
        Encuesta.fecha_fin >= datetime.utcnow()
    )
    return db.scalars(stmt).all()

def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> schemas.Encuesta:
    # Crea una nueva encuesta 
    if encuesta.fecha_inicio >= encuesta.fecha_fin:
        raise exceptions.FechasEncuestaInvalidas()
    
    _encuesta = Encuesta(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def leer_encuesta(db: Session, encuesta_id: int, cargar_relaciones: bool = False) -> schemas.Encuesta:
    # Obtiene una encuesta por ID
    stmt = select(Encuesta).where(Encuesta.id == encuesta_id)
    
    # Carga optimizada de relaciones
    if cargar_relaciones:
        stmt = stmt.options(
            selectinload(Encuesta.asignatura),
        )
    
    db_encuesta = db.scalar(stmt)
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta

def modificar_encuesta(
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaUpdate
) -> Encuesta:
    # Actualiza una encuesta existente
    db_encuesta = leer_encuesta(db, encuesta_id)
    
    update_data = encuesta.model_dump(exclude_unset=True)
    
    if not update_data:
        return db_encuesta  
    
    if 'fecha_inicio' in update_data and 'fecha_fin' in update_data:
        if update_data['fecha_inicio'] >= update_data['fecha_fin']:
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

def listar_categorias_encuesta(db: Session, encuesta_id: int) -> List[categoria_schemas.Categoria]:
    # Obtiene categorías de una encuesta específica
    db_encuesta = leer_encuesta(db, encuesta_id)
    return db_encuesta.categorias if hasattr(db_encuesta, 'categorias') else []

def listar_encuestas_pregunta_cerrada(db: Session, encuesta_id: int) -> List[pregunta_schemas.Pregunta]:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id == encuesta_id))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    
    respuestas=[]
    for categoria in db_encuesta.categorias:
        for pregunta in categoria.preguntas:
            if pregunta.tipo == "cerrada":
                respuestas.append(pregunta)

    return respuestas

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
    """
    Obtiene todas las respuestas asociadas a una encuesta específica.
    """
    # Verificar que la encuesta exista
    from src.preguntas.models import Pregunta
    encuesta = leer_encuesta(db, encuesta_id)
    if encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    
    stmt = (
        select(Respuesta, Pregunta.texto)
        .join(Respuesta.encuesta_finalizada)  
        .join(Pregunta, Respuesta.pregunta_id == Pregunta.id)
        .where(EncuestaFinalizada.encuesta_id == encuesta_id)
    )

    resultados = db.execute(stmt).all()

    preguntas_con_respuestas = []
    preguntas_con_respuestas = []
    
    for respuesta, pregunta_texto in resultados:
        pregunta_existente = next(
            (p for p in preguntas_con_respuestas if p["pregunta_id"] == respuesta.pregunta_id), 
            None
        )
        
        respuesta_data = {
            "id": respuesta.id,
            "alumno_id": respuesta.alumno_id,
            "respuesta_texto": respuesta.respuesta_texto,
            "opcion_multiple": getattr(respuesta, 'opcion_multiple', None),
            "progreso": getattr(respuesta, 'progreso', 100)
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
        print("ASIGNATURA:", encuesta.asignatura)
        print("DOCENTE:", encuesta.asignatura.docente if encuesta.asignatura else None)

        # Docente
        docente_nombre = "No asignado"
        if encuesta.asignatura and encuesta.asignatura.docente:
            persona = encuesta.asignatura.docente.persona if hasattr(encuesta.asignatura.docente, "persona") else None
            if persona:
                nombre = getattr(persona, "nombre", "") or getattr(persona, "nombres", "")
                apellido = getattr(persona, "apellido", "") or getattr(persona, "apellidos", "")
                docente_nombre = f"{apellido}, {nombre}".strip(", ")

        # Año (campo de Encuesta)
        anio = encuesta.año if hasattr(encuesta, "año") else encuesta.anio

        # Duración (enum o string)
        duracion = encuesta.duracion if isinstance(encuesta.duracion, str) else encuesta.duracion.value

        # Ciclo lectivo estándar
        ciclo_lectivo = f"{anio}-{duracion.lower().replace(' ', '_')}"

        resultado.append(
            schemas.EncuestaAlumnoInfo(
                id=encuesta.id,
                nombre=encuesta.titulo,
                asignatura=encuesta.asignatura.nombre if encuesta.asignatura else "Sin asignatura",
                docente=docente_nombre,
                anio=encuesta.año,   # ← ESTE FALTABA
                ciclo_lectivo=f"{encuesta.año}-{encuesta.duracion}"
            )
        )


    return resultado


def obtener_encuesta_para_completar(db: Session, encuesta_id: int) -> dict:
    from src.docentes.models import Docente
    from src.categorias.models import Categoria
    from src.preguntas.models import Pregunta

    # 1. Obtener encuesta
    encuesta = db.query(Encuesta).filter(Encuesta.id == encuesta_id).first()
    if not encuesta:
        raise exceptions.EncuestaNoEncontrada()

    if not encuesta.activa or encuesta.estado != EstadoEncuesta.abierta:
        raise exceptions.EncuestaNoDisponible()

    # 2. Asignatura
    asignatura = db.query(Asignatura).filter(
        Asignatura.id == encuesta.asignatura_id
    ).first()

    if not asignatura:
        raise exceptions.EncuestaNoEncontrada("Asignatura no encontrada")

    # 3. Docente correcto (usando relación)
    docente = asignatura.docente   # propiedad definida en modelo
    if docente and docente.persona:
        docente_nombre = f"{docente.persona.apellido}, {docente.persona.nombre}"
    else:
        docente_nombre = "No asignado"

    # 4. Duración legible
    duracion_legible = {
        "primer_cuat": "1er Cuatrimestre",
        "segundo_cuat": "2do Cuatrimestre",
        "anual": "Anual"
    }.get(encuesta.duracion, encuesta.duracion)

    # 5. Categorías + preguntas
    categorias = (
        db.query(Categoria)
        .filter(Categoria.encuesta_id == encuesta_id)
        .order_by(Categoria.orden)
        .all()
    )

    categorias_data = []

    for categoria in categorias:
        preguntas = (
            db.query(Pregunta)
            .filter(
                Pregunta.categoria_id == categoria.id,
                Pregunta.encuesta_id == encuesta_id
            )
            .order_by(Pregunta.id)
            .all()
        )

        preguntas_data = []
        for pregunta in preguntas:
            pregunta_dict = {
                "id": pregunta.id,
                "texto": pregunta.texto,
                "tipo": pregunta.tipo,
                "opciones": [
                    {"id": o.id, "texto": o.contenido, "valor": None}
                    for o in pregunta.opciones
                ] if pregunta.tipo != "abierta" else []
            }
            preguntas_data.append(pregunta_dict)

        categorias_data.append({
            "id": categoria.id,
            "codigo": categoria.codigo,
            "texto": categoria.texto,
            "preguntas": preguntas_data
        })

    # 6. Respuesta final corregida
    return {
        "id": encuesta.id,
        "titulo": encuesta.titulo,
        "asignatura": asignatura.nombre,
        "docente": docente_nombre,

        # LO QUE FALTABA
        "anio": encuesta.año,

        # duración bonita
        "duracion": duracion_legible,

        # ciclo lectivo correcto
        "ciclo_lectivo": f"{encuesta.año}",

        "codigo_asignatura": getattr(asignatura, "codigo", "N/A"),
        "carrera": encuesta.carrera,
        "categorias": categorias_data,
        "preguntas_abiertas": []
    }




def guardar_respuestas_encuesta(db: Session, respuestas_data: schemas.RespuestaEncuesta):
    print("🔥 EJECUTANDO guardar_respuestas_encuesta")

    from src.encuesta_finalizada.models import EncuestaFinalizada
    from src.respuestas.models import Respuesta
    from datetime import datetime
    
    # 1. Leer la encuesta
    encuesta = leer_encuesta(db, respuestas_data.encuesta_id)

    # 2. Crear registro de encuesta finalizada
    encuesta_finalizada = EncuestaFinalizada(
        encuesta_id=respuestas_data.encuesta_id,
        alumno_id=respuestas_data.alumno_id,
        asignatura_id=encuesta.asignatura_id,
        anio=encuesta.año,
        duracion=encuesta.duracion,
        fecha_finalizada=datetime.utcnow(),
    )

    db.add(encuesta_finalizada)
    db.flush()  # Obtener ID para respuestas

    # 3. Guardar cada respuesta
    for respuesta in respuestas_data.respuestas:
        nueva = Respuesta(
            alumno_id=respuestas_data.alumno_id,
            encuesta_finalizada_id=encuesta_finalizada.id,
            pregunta_id=respuesta.pregunta_id,
            opcion_id=respuesta.opcion_id,
            respuesta_texto=respuesta.texto
        )
        db.add(nueva)

    db.commit()
    return {"message": "Encuesta finalizada exitosamente"}
