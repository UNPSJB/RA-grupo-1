from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.personas import services, schemas
from src.personas.exceptions import PersonaNoEncontrada, PersonaDuplicada

router = APIRouter(prefix="/personas", tags=["personas"])

@router.post("/", response_model=schemas.Persona)
def create_persona(persona: schemas.PersonaCreate, db: Session = Depends(get_db)):
    try:
        return services.crear_persona(db, persona)
    except (PersonaDuplicada, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/", response_model=list[schemas.Persona])
def read_personas(db: Session = Depends(get_db)):
    return services.listar_personas(db)

@router.get("/{persona_id}", response_model=schemas.Persona)
def read_persona(persona_id: int, db: Session = Depends(get_db)):
    try:
        return services.leer_persona(db, persona_id)
    except PersonaNoEncontrada as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{persona_id}", response_model=schemas.Persona)
def update_persona(
    persona_id: int, persona: schemas.PersonaUpdate, db: Session = Depends(get_db)
):
    try:
        return services.modificar_persona(db, persona_id, persona)
    except PersonaNoEncontrada as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PersonaDuplicada as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{persona_id}", response_model=dict)
def delete_persona(persona_id: int, db: Session = Depends(get_db)):
    try:
        return services.eliminar_persona(db, persona_id)
    except PersonaNoEncontrada as e:
        raise HTTPException(status_code=404, detail=str(e))
