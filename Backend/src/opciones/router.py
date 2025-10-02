from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.opciones import services, schemas

router = APIRouter(prefix="/opciones", tags=["Opciones"])

@router.post("/", response_model=schemas.Opcion)
def crear_opcion(opcion: schemas.OpcionCreate, db: Session = Depends(get_db)):
    return services.crear_opcion(db, opcion)

@router.get("/", response_model=list[schemas.Opcion])
def leer_opciones(db: Session = Depends(get_db)) -> list[schemas.Opcion]:
    return services.listar_opciones(db)

@router.get("/{opcion_id}", response_model=schemas.Opcion)
def leer_opcion(opcion_id: int, db: Session = Depends(get_db)) -> schemas.Opcion:
    return services.obtener_opcion(db, opcion_id)

@router.put("/{opcion_id}", response_model=schemas.Opcion)
def renovar_opcion(opcion_id: int, opcion: schemas.OpcionUpdate, db: Session = Depends(get_db)) -> schemas.Opcion:
    return services.renovar_opcion(db, opcion_id, opcion)

@router.delete("/{opcion_id}", response_model=schemas.OpcionDelete)
def borrar_opcion(opcion_id: int, db: Session = Depends(get_db)) -> schemas.OpcionDelete:
    return services.eliminar_opcion(db, opcion_id)

