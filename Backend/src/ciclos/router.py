from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.ciclos import services, schemas

router = APIRouter(prefix="/ciclos", tags=["ciclos encuesta"])

@router.post("/", response_model=schemas.CicloOut)
def create_ciclo(ciclo: schemas.CicloCreate, db: Session = Depends(get_db)):
    return services.create_ciclo(db, ciclo)

@router.get("/", response_model=list[schemas.CicloOut])
def list_ciclos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return services.get_ciclos(db, skip, limit)

@router.get("/{ciclo_id}", response_model=schemas.CicloOut)
def get_ciclo(ciclo_id: int, db: Session = Depends(get_db)):
    db_ciclo = services.get_ciclo(db, ciclo_id)
    if not db_ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    return db_ciclo

@router.put("/{ciclo_id}", response_model=schemas.CicloOut)
def update_ciclo(ciclo_id: int, ciclo: schemas.CicloUpdate, db: Session = Depends(get_db)):
    db_ciclo = services.update_ciclo(db, ciclo_id, ciclo)
    if not db_ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    return db_ciclo

@router.delete("/{ciclo_id}")
def delete_ciclo(ciclo_id: int, db: Session = Depends(get_db)):
    db_ciclo = services.delete_ciclo(db, ciclo_id)
    if not db_ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    return {"ok": True, "message": "Ciclo eliminado"}