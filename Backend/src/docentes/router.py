from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.docentes import schemas, services
from src.docentes import services as docente_services

router = APIRouter(prefix="/docentes", tags=["docentes"])

@router.get("/", response_model=List[schemas.Docente])
def read_docentes(db: Session = Depends(get_db)):
    # Obtiene la lista de todos los docente con sus datos personales
    return services.listar_docentes(db)

@router.get("/{docente_id}", response_model=schemas.Docente)
def read_docente(docente_id: int, db: Session = Depends(get_db)):
    # Obtiene un docente especifico por ID
    docente = services.leer_docente(db, docente_id)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    return docente

@router.post("/{docente_id}/asignaturas/{asignatura_id}")
def asignar_asignatura_docente(
    docente_id: int, 
    asignatura_id: int, 
    db: Session = Depends(get_db)
):
    # Asigna una asignatura a un docente
    resultado = services.asignar_asignatura(db, docente_id, asignatura_id)
    if not resultado:
        raise HTTPException(
            status_code=404, 
            detail="Docente o asignatura no encontrados"
        )
    return {"mensaje": "Asignatura asignada correctamente al docente"}

@router.get("/{docente_id}/asignaturas")
def obtener_asignaturas_docente(docente_id: int, db: Session = Depends(get_db)):
    # Obtiene todas las asignaturas de un docente específico
    docente = services.leer_docente(db, docente_id)
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    
    asignaturas = services.ver_asignaturas_docente(db, docente_id)
    return {
        "docente_id": docente.id,
        "persona": {
            "nombre": docente.persona.nombre,
            "apellido": docente.persona.apellido
        },
        "asignaturas": asignaturas
    }

@router.delete("/{docente_id}/asignaturas/{asignatura_id}")
def eliminar_asignatura_docente(
    docente_id: int, 
    asignatura_id: int, 
    db: Session = Depends(get_db)
):
    # Elimina la asignatura de un docente
    resultado = services.eliminar_asignatura_docente(db, docente_id, asignatura_id)
    if not resultado:
        raise HTTPException(
            status_code=404, 
            detail="Asignación no encontrada"
        )
    return {"mensaje": "Asignatura eliminada del docente correctamente"}

@router.post("/persona/{persona_id}")
def crear_docente_desde_persona(
    persona_id: int, 
    db: Session = Depends(get_db)
):
    # Convierte una persona en docente
    resultado = services.crear_docente_desde_persona(db, persona_id)
    if not resultado:
        raise HTTPException(
            status_code=400, 
            detail="No se pudo crear el docente. La persona no existe o ya es docente"
        )
    return {"mensaje": "Docente creado correctamente", "docente": resultado}