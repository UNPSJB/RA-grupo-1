from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.asignaturas import schemas, services
from src.departamentos.models import Departamento

router = APIRouter(prefix="/asignaturas", tags=["asignaturas"])

@router.get("/", response_model=list[schemas.Asignatura])
def listar_asignaturas(db: Session = Depends(get_db)):
    """Listar todas las asignaturas"""
    return services.listar_asignaturas(db)

@router.get("/{asignatura_id}", response_model=schemas.Asignatura)
def obtener_asignatura(asignatura_id: int, db: Session = Depends(get_db)):
    """Obtener una asignatura por ID"""
    return services.leer_asignatura(db, asignatura_id)

@router.post("/", response_model=schemas.Asignatura)
def crear_asignatura(asignatura: schemas.AsignaturaCreate, db: Session = Depends(get_db)):
    """Crear una nueva asignatura"""
    if asignatura.departamento_id is None:
        primer_departamento = db.query(Departamento).first()
        if not primer_departamento:
            raise HTTPException(
                status_code=400, 
                detail="No hay departamentos disponibles. Crea un departamento primero."
            )
        asignatura.departamento_id = primer_departamento.id
    return services.crear_asignatura(db, asignatura)

@router.put("/{asignatura_id}", response_model=schemas.Asignatura)
def actualizar_asignatura(
    asignatura_id: int, 
    asignatura_actualizada: schemas.AsignaturaBase, 
    db: Session = Depends(get_db)
):
    """Actualizar una asignatura existente"""
    return services.actualizar_asignatura(db, asignatura_id, asignatura_actualizada)

@router.delete("/{asignatura_id}")
def eliminar_asignatura(asignatura_id: int, db: Session = Depends(get_db)):
    """Eliminar una asignatura"""
    services.eliminar_asignatura(db, asignatura_id)
    return {"message": "Asignatura eliminada correctamente"}