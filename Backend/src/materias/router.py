from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.materias import services, schemas

router = APIRouter(prefix="/materias", tags=["materias"])

@router.post("/", response_model=schemas.Materia)
def create_materia(materia: schemas.MateriaCreate, db: Session = Depends(get_db)):
    return services.crear_materia(db, materia)

@router.get("/", response_model=list[schemas.Materia])
def read_materias(db: Session = Depends(get_db)):
    return services.listar_materias(db)

@router.get("/{materia_id}", response_model=schemas.Materia)
def read_materia(materia_id: int, db: Session = Depends(get_db)):
    return services.leer_materia(db, materia_id)

@router.put("/{materia_id}", response_model=schemas.Materia)
def update_materia(
    materia_id: int, materia: schemas.MateriaUpdate, db: Session = Depends(get_db)
):
    return services.modificar_materia(db, materia_id, materia)

@router.delete("/{materia_id}", response_model=dict)
def delete_materia(materia_id: int, db: Session = Depends(get_db)):
    return services.eliminar_materia(db, materia_id)

@router.get("/{materia_id}/pregunta/{pregunta_id}/distribucion", response_model=dict)
def distribucion_respuestas_materia(materia_id: int, pregunta_id: int, db: Session = Depends(get_db)):
    return services.distribuir_resp_materia(db, materia_id, pregunta_id)
