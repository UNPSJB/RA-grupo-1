from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.personas import services
from src.personas.schemas import Persona, PersonaCreate
from src.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(prefix="/personas", tags=["personas"])

@router.post("/", response_model=Persona)
def crear_persona(persona: PersonaCreate, db: Session = Depends(get_db)):
    return services.crear_persona(db, persona)

@router.get("/")
def listar_personas(db: Session = Depends(get_db)):
    return db.query(PersonaModel).all()
