from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.database import get_db
from src.encuestas import schemas, services
from src.categorias import schemas as categoria_schemas
from src.preguntas import schemas as pregunta_schemas
from src.encuestas.models import Encuesta, EstadoEncuesta
from src.preguntas.models import Pregunta, TipoPreguntaEnum
from src.asignaturas.models import Asignatura
from src.docentes.models import Docente
from src.encuestas.models import Encuesta
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.respuestas.models import Respuesta
from typing import List
from src.ciclos.models import CicloEncuesta

from src.encuestas.exceptions import (
    EncuestaNoEncontrada,
    FechasEncuestaInvalidas, 
    EncuestaNoDisponible,
    EncuestaYaRespondida
)

from src.encuestas.schemas import (
    EncuestaParaCompletar,
    EncuestaAlumnoInfo,
    PreguntaParaEstudiante,
    CategoriaConPreguntas,
    PreguntaAbiertaEstudiante
)


router = APIRouter(prefix="/encuestas", tags=["encuestas"])

@router.get("/", 
            response_model=List[schemas.Encuesta],
            summary="Listar todas las encuestas",
            description="Retorna una lista de todas las encuestas")
def read_encuestas(db: Session = Depends(get_db)):
    return services.listar_encuestas_activas(db)

@router.get("/{encuesta_id}", response_model=schemas.Encuesta)
def read_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene una encuesta específica
    encuesta = services.leer_encuesta(db, encuesta_id)
    if not encuesta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return encuesta

# crea encuesta
@router.post("/", response_model=schemas.Encuesta, status_code=status.HTTP_201_CREATED)
def create_encuesta(encuesta: schemas.EncuestaCreate, db: Session = Depends(get_db)):
    try:
        return services.crear_encuesta(db, encuesta)
    except FechasEncuestaInvalidas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las fechas de la encuesta son inválidas. La fecha de inicio debe ser anterior a la fecha de fin"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/{encuesta_id}/alumnos", response_model=List[schemas.EstadoEncuesta])
def read_alumnos_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene alumnos vinculados a una encuesta
    return services.listar_alumnos_encuesta(db, encuesta_id)
 
@router.put("/{encuesta_id}", response_model=schemas.Encuesta)
def update_encuesta(encuesta_id: int, encuesta: schemas.EncuestaUpdate, db: Session = Depends(get_db)):
    # Actualiza una encuesta existente
    encuesta_actualizada = services.modificar_encuesta(db, encuesta_id, encuesta)
    if not encuesta_actualizada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return encuesta_actualizada

@router.delete("/{encuesta_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Elimina una encuesta
    try:
        services.eliminar_encuesta(db, encuesta_id)
        return None
    except EncuestaNoEncontrada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )

@router.get("/{encuesta_id}/categorias", response_model=List[categoria_schemas.Categoria])
def read_categorias_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene categorías de una encuesta específica
    # Primero verifica que la encuesta existe
    encuesta = services.leer_encuesta(db, encuesta_id)
    if not encuesta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return services.listar_categorias_encuesta(db, encuesta_id)

@router.get("/{encuesta_id}/preguntas", response_model=List[pregunta_schemas.Pregunta])
def read_preguntas_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    # Obtiene preguntas de una encuesta específica
    # Primero verificar que la encuesta existe
    encuesta = services.leer_encuesta(db, encuesta_id)
    if not encuesta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    return services.listar_preguntas_encuesta(db, encuesta_id)

@router.post("/{encuesta_id}/alumnos/{alumno_id}", response_model=schemas.Encuesta)
def vincular_alumno_encuesta(encuesta_id: int, alumno_id: int, db: Session = Depends(get_db)):
    # Vincula un alumno a una encuesta
    return services.vincular_alumno_encuesta(db, encuesta_id, alumno_id)

@router.get("/{encuesta_id}/respuestas", response_model=list[schemas.PreguntaConRespuestas])
def obtener_respuestas(encuesta_id: int, db: Session = Depends(get_db)):
    return services.obtener_respuestas_por_encuesta(db, encuesta_id)

@router.get("/{encuesta_id}/respuestas/{alumno_id}", summary="Obtener respuestas del alumno (solo lectura)")
def obtener_respuestas_alumno(encuesta_id: int, alumno_id: int, db: Session = Depends(get_db)):
    respuestas = (
        db.query(Respuesta)
        .options(joinedload(Respuesta.pregunta))
        .filter(Respuesta.encuesta_id == encuesta_id, Respuesta.alumno_id == alumno_id)
        .all()
    )

    if not respuestas:
        raise HTTPException(status_code=404, detail="No se encontraron respuestas para esta encuesta.")

    data = [
        {
            "pregunta_id": r.pregunta_id,
            "pregunta_texto": r.pregunta.texto,
            "respuesta": r.texto_respuesta or r.opcion_seleccionada or r.subrespuestas
        }
        for r in respuestas
    ]

    return {"encuesta_id": encuesta_id, "respuestas": data}

@router.get("/alumno/{alumno_id}/disponibles", 
           response_model=List[schemas.EncuestaAlumnoInfo],
           summary="Obtener encuestas disponibles para alumno")
def obtener_encuestas_alumno(alumno_id: int, db: Session = Depends(get_db)):
    print(f"✅ ENDPOINT CORRECTO ALCANZADO - Alumno ID: {alumno_id}")
    try:
        encuestas = services.listar_encuestas_para_alumno(db, alumno_id)
        return encuestas
    except Exception as e:
        # ✅ AGREGAR ESTO PARA VER EL ERROR COMPLETO
        import traceback
        print("❌ ERROR COMPLETO:")
        print(traceback.format_exc())
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener encuestas: {str(e)}"
        )

@router.get("/{encuesta_id}/completar",
           response_model=schemas.EncuestaParaCompletar,  
           summary="Obtener encuesta para completar")
def obtener_encuesta_completar(encuesta_id: int, db: Session = Depends(get_db)):
    """
    Obtiene toda la información de una encuesta específica para que el alumno la complete
    """
    try:
        encuesta = services.obtener_encuesta_para_completar(db, encuesta_id)  
        return encuesta
    except EncuestaNoEncontrada:  
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    except EncuestaNoDisponible:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La encuesta no está disponible en este momento"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener encuesta: {str(e)}"
        )

@router.post("/respuestas",
            status_code=status.HTTP_201_CREATED,
            summary="Guardar respuestas de encuesta")
def guardar_respuestas(respuestas: schemas.RespuestaEncuesta, db: Session = Depends(get_db)):
    """
    Guarda las respuestas de una encuesta finalizada por un alumno
    """
    try:
        resultado = services.guardar_respuestas_encuesta(db, respuestas)
        return resultado
    except EncuestaNoEncontrada:  
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encuesta no encontrada"
        )
    except EncuestaNoDisponible:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La encuesta no está disponible"
        )
    except EncuestaYaRespondida:  
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya has completado esta encuesta"
        )
    except Exception as e:
        import traceback
        print("🔥 ERROR COMPLETO EN BACKEND:")
        traceback.print_exc(
        )
@router.get("/alumno/{alumno_id}/finalizadas")
def listar_encuestas_finalizadas(alumno_id: int, db: Session = Depends(get_db)):
    """
    Devuelve las encuestas que el alumno ya completó,
    con datos listos para mostrar en la card de 'Encuestas Completadas'.
    """
    # Traemos todas las encuestas finalizadas de ese alumno
    finalizadas = (
        db.query(EncuestaFinalizada)
        .filter(EncuestaFinalizada.alumno_id == alumno_id)
        .all()
    )

    resultado = []

    for f in finalizadas:
        encuesta = f.encuesta        # relación a Encuesta
        asignatura = f.asignatura    # relación a Asignatura

        # Nombre de la asignatura
        asignatura_nombre = asignatura.nombre if asignatura else "Sin asignatura"

        # Docente a cargo (usando la property docente de Asignatura)
        docente_nombre = "No asignado"
        if asignatura and asignatura.docente:
            persona = asignatura.docente.persona if hasattr(asignatura.docente, "persona") else None
            if persona:
                nombre = getattr(persona, "nombre", "") or getattr(persona, "nombres", "")
                apellido = getattr(persona, "apellido", "") or getattr(persona, "apellidos", "")
                docente_nombre = f"{apellido}, {nombre}".strip(", ") or "Docente sin nombre"
            else:
                docente_nombre = "Docente sin persona"

        # Ciclo lectivo tipo: "2025-anual"
        # Formato humano de duración
        if f.duracion.value == "primer_cuat":
            duracion_humana = "1er Cuatrimestre"
        elif f.duracion.value == "segundo_cuat":
            duracion_humana = "2do Cuatrimestre"
        elif f.duracion.value == "anual":
            duracion_humana = "Anual"
        else:
            duracion_humana = f.duracion.value

        # Ciclo lectivo: solo texto (no 2025-anual)
        ciclo_lectivo = duracion_humana

        resultado.append(
            {
                "id_finalizada": f.id,
                "encuesta_id": f.encuesta_id,
                "asignatura_id": f.asignatura_id,
                "titulo": encuesta.titulo if encuesta else "",
                "anio": f.anio,
                "duracion": duracion_humana,
                "ciclo_lectivo": ciclo_lectivo,
                "asignatura": asignatura_nombre,
                # SE ELIMINA: "sede_id": encuesta.sede_id
                "docente": docente_nombre,
                "fecha_finalizada": f.fecha_finalizada.isoformat() if f.fecha_finalizada else None,
            }
        )

    return resultado

@router.get("/finalizadas/{encuesta_finalizada_id}")
def obtener_detalle_encuesta_finalizada(
    encuesta_finalizada_id: int, db: Session = Depends(get_db)
):
    """
    Devuelve el detalle de una encuesta finalizada:
    datos generales + preguntas y respuestas.
    """
    # Buscar la encuesta finalizada
    f = db.query(EncuestaFinalizada).filter(EncuestaFinalizada.id == encuesta_finalizada_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Encuesta finalizada no encontrada")

    encuesta = f.encuesta
    asignatura = f.asignatura

    # Docente (igual que antes)
    docente_nombre = "No asignado"
    if asignatura and asignatura.docente:
        persona = asignatura.docente.persona if hasattr(asignatura.docente, "persona") else None
        if persona:
            nombre = getattr(persona, "nombre", "") or getattr(persona, "nombres", "")
            apellido = getattr(persona, "apellido", "") or getattr(persona, "apellidos", "")
            docente_nombre = f"{apellido}, {nombre}".strip(", ") or "Docente sin nombre"
        else:
            docente_nombre = "Docente sin persona"

    ciclo_lectivo = f"{f.anio}-{f.duracion.value}"

    # Cargar respuestas + texto de la pregunta + opción
    respuestas_detalle = []
    for r in f.respuestas:
        pregunta = r.pregunta
        opcion = r.opcion

        respuestas_detalle.append(
            {
                "pregunta_id": r.pregunta_id,
                "pregunta": pregunta.texto if pregunta else "",
                "respuesta_texto": r.respuesta_texto,
                "opcion_id": r.opcion_id,
                "opcion_texto": opcion.texto if opcion else None,
            }
        )

    return {
        "id_finalizada": f.id,
        "encuesta_id": f.encuesta_id,
        "asignatura_id": f.asignatura_id,
        "titulo": encuesta.titulo if encuesta else "",
        "anio": f.anio,
        "duracion": f.duracion.value,
        "ciclo_lectivo": ciclo_lectivo,
        "asignatura": asignatura.nombre if asignatura else "Sin asignatura",
        "sede_id": encuesta.sede_id if encuesta else None,
        "docente": docente_nombre,
        "respuestas": respuestas_detalle,
    }
