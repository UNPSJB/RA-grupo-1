from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas import schemas, services
from src.categorias import schemas as categoria_schemas
from src.preguntas import schemas as pregunta_schemas
from src.encuestas.models import Encuesta, EstadoEncuesta
from src.preguntas.models import Pregunta, TipoPreguntaEnum
from src.asignaturas.models import Asignatura
from src.docentes.models import Docente

from typing import List
from src.encuestas.exceptions import (
    EncuestaNoEncontrada,
    FechasEncuestaInvalidas, 
    EncuestaNoDisponible,
    EncuestaYaRespondida
)


router = APIRouter(prefix="/encuestas", tags=["encuestas"])

@router.get("/", 
            response_model=List[schemas.Encuesta],
            summary="Listar todas las encuestas",
            description="Retorna una lista de todas las encuestas")
def read_encuestas(db: Session = Depends(get_db)):
    return services.listar_encuestas(db)

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

@router.get("/{encuesta_id}/encuesta")
async def obtener_encuesta(
    encuesta_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtiene el encuesta completo de una encuesta para que el alumno la complete.
    """
    try:
        print(f"🔍 Solicitando encuesta para encuesta ID: {encuesta_id}")
        
        # 1. Obtener encuesta
        encuesta = db.query(Encuesta).filter(Encuesta.id == encuesta_id).first()
        if not encuesta:
            print(f"❌ Encuesta {encuesta_id} no encontrada")
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        
        print(f"✅ Encuesta encontrada: {encuesta.titulo}")
        
        # 2. Validar que la encuesta esté activa
        if not encuesta.activa or encuesta.estado != EstadoEncuesta.abierta:
            print(f"❌ Encuesta {encuesta_id} no está disponible")
            raise HTTPException(
                status_code=400, 
                detail="La encuesta no está disponible en este momento"
            )
        
        # 3. Obtener asignatura
        asignatura = db.query(Asignatura).filter(Asignatura.id == encuesta.asignatura_id).first()
        if not asignatura:
            print(f"❌ Asignatura {encuesta.asignatura_id} no encontrada")
            raise HTTPException(status_code=404, detail="Asignatura no encontrada")
        
        print(f"✅ Asignatura encontrada: {asignatura.nombre}")
        
        # 4. Obtener docente
        docente = None
        if asignatura.docente_id:
            docente = db.query(Docente).filter(Docente.id == asignatura.docente_id).first()
            if docente:
                print(f"✅ Docente encontrado: {docente.nombre} {docente.apellido}")
        
        # 5. Obtener preguntas asociadas a la encuesta
        preguntas = db.query(Pregunta).filter(
            Pregunta.encuesta_id == encuesta_id
        ).order_by(Pregunta.id).all()
        
        print(f"✅ {len(preguntas)} preguntas encontradas")
        
        # 6. Construir respuesta para Ciclo Básico
        response_data = {
            "encuesta": {
                "id": encuesta.id,
                "titulo": encuesta.titulo,
                "tipo": "ciclo_basico",
                "escala": {
                    "tipo": "sino_npo",
                    "valores": [
                        {"valor": "si", "etiqueta": "Sí"},
                        {"valor": "no", "etiqueta": "No"},
                        {"valor": "npo", "etiqueta": "No puedo opinar"}
                    ]
                }
            },
            "asignatura": {
                "id": asignatura.id,
                "nombre": asignatura.nombre,
                "codigo": getattr(asignatura, 'codigo', None)
            },
            "docente": {
                "id": docente.id if docente else None,
                "nombre": docente.nombre if docente else "No asignado",
                "apellido": docente.apellido if docente else ""
            } if docente else None,
            "preguntas": [
                {
                    "id": p.id,
                    "texto": p.texto,
                    "tipo": "escala",
                    "categoria": getattr(p.categoria, 'nombre', 'General') if p.categoria else "General",
                    "seccion": "A"  # Por defecto, ajustar según tu lógica
                }
                for p in preguntas
            ],
            "preguntas_abiertas": [
                {
                    "id": "comentarios_positivos",
                    "texto": "¿Qué aspectos valoras como positivos del cursado de la asignatura? Menciona los que consideres más importantes.",
                    "tipo": "abierta",
                    "seccion": "G"
                },
                {
                    "id": "comentarios_mejora", 
                    "texto": "¿Qué aspectos consideras que se pueden mejorar? Menciona los que consideres más importantes.",
                    "tipo": "abierta",
                    "seccion": "G"
                },
                {
                    "id": "recomendaciones",
                    "texto": "¿Qué recomendaciones le harías a un compañero que cursará el año que viene la asignatura?",
                    "tipo": "abierta", 
                    "seccion": "G"
                }
            ]
        }
        
        print("✅ encuesta construido exitosamente")
        return response_data
        
    except HTTPException as he:
        print(f"❌ HTTPException: {he.detail}")
        raise he
    except Exception as e:
        print(f"❌ Error interno: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
"""
@router.get("/alumno/{alumno_id}/disponibles", 
           response_model=List[schemas.EncuestaAlumnoInfo],
           summary="Obtener encuestas disponibles para alumno")
def obtener_encuestas_alumno(alumno_id: int, db: Session = Depends(get_db)):
    
    Obtiene la lista de encuestas disponibles para que un alumno complete
    
    try:
        encuestas = services.listar_encuestas_para_alumno(db, alumno_id)
        return encuestas
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener encuestas: {str(e)}"
        )
"""
@router.get("/alumno/{alumno_id}/disponibles", response_model=List[schemas.EncuestaAlumnoInfo])
def obtener_encuestas_alumno(alumno_id: int, db: Session = Depends(get_db)):
    print("\n🔍 Buscando encuestas disponibles para alumno:", alumno_id)
    try:
        encuestas = services.listar_encuestas_para_alumno(db, alumno_id)
        print("✅ Encuestas encontradas:", encuestas)
        return encuestas
    except Exception as e:
        print("❌ ERROR EN SERVICIO:", type(e).__name__, str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{type(e).__name__}: {str(e)}"
        )


@router.get("/{encuesta_id}/completar",
           response_model=schemas.EncuestaParaCompletarEstudiante,  
           summary="Obtener encuesta para completar")
def obtener_encuesta_completar(encuesta_id: int, db: Session = Depends(get_db)):
    """
    Obtiene toda la información de una encuesta específica para que el estudiante la complete
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
    Guarda las respuestas de una encuesta completada por un estudiante
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al guardar respuestas: {str(e)}"
        )