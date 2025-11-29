from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select 
from src.database import get_db
from src.personas import services, schemas
from src.personas.exceptions import PersonaNoEncontrada, PersonaDuplicada
from src.personas.models import Persona
from src.alumnos.models import Alumno  
from src.users.models import User
from src.auth.utils import get_password_hash

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
    
@router.post("/registro")
def registrar_alumno(data: dict, db: Session = Depends(get_db)):

    # ------------------------------------------------------------
    # 1) Validar que NO exista ya un alumno con ese usuario
    # ------------------------------------------------------------
    existe_usuario = (
        db.execute(
            select(User).where(User.username == data.get("usuario"))
        ).scalar_one_or_none()
    )

    if existe_usuario:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario ya está registrado"
        )

    # ------------------------------------------------------------
    # 2) Validar email duplicado
    # ------------------------------------------------------------
    existe_email_user = (
        db.execute(
            select(User).where(User.email == data.get("email"))
        ).scalar_one_or_none()
    )
    if existe_email_user:
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado en el sistema"
        )

    existe_email_persona = (
        db.execute(
            select(Persona).where(Persona.email == data.get("email"))
        ).scalar_one_or_none()
    )
    if existe_email_persona:
        raise HTTPException(
            status_code=400,
            detail="El email ya está en uso por otra persona"
        )

    # ------------------------------------------------------------
    # 3) Crear Persona
    # ------------------------------------------------------------
    nueva_persona = Persona(
        nombre=data.get("nombre"),
        apellido=data.get("apellido"),
        dni=data.get("dni"),
        email=data.get("email"),
        legajo=data.get("legajo"),
        cuil=data.get("cuil"),
        rol_id=1  # ALUMNO
    )

    db.add(nueva_persona)
    db.commit()
    db.refresh(nueva_persona)

    # ------------------------------------------------------------
    # 4) Crear Alumno
    # ------------------------------------------------------------
    nuevo_alumno = Alumno(
        persona_id=nueva_persona.id,
        legajo=data.get("legajo")
    )
    db.add(nuevo_alumno)
    db.commit()
    db.refresh(nuevo_alumno)

    hashed = get_password_hash(data["clave"])

    user = User(
        username=data["usuario"],
        email=data["email"],
        hashed_password=hashed,
        role_id=2,                
        alumno_id=nuevo_alumno.id
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # ------------------------------------------------------------
    # 6) Respuesta final
    # ------------------------------------------------------------
    return {
        "msg": "Alumno registrado correctamente",
        "persona_id": nueva_persona.id,
        "alumno_id": nuevo_alumno.id,
        "user_id": user.id
    }
