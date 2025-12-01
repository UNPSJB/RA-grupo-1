from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from src.sedes import services, schemas 
from typing import List

router = APIRouter(prefix="/sedes", tags=["Sedes"])

@router.get("/", response_model=List[schemas.Sede])
def get_all_sedes(db: Session = Depends(get_db)):
    return services.get_sedes(db) 