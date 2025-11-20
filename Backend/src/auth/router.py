from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.database import get_db
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.auth.schemas import LoginRequest, LoginResponse  
import logging

router = APIRouter(prefix="/auth")

@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, session: Session = Depends(get_db)):

    logging.info(f"🔐 Intento de login con usuario: {credentials.usuario}")

    stmt = (
        select(Alumno, Persona)
        .join(Persona, Alumno.persona_id == Persona.id)
        .where(Alumno.usuario == credentials.usuario)
    )

    result = session.execute(stmt).first()

    if not result:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    alumno, persona = result

    if alumno.clave != credentials.clave:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # GENERACIÓN DE TOKEN (por ahora algo simple)
    token = f"TOKEN-{alumno.id}"

    return LoginResponse(
        token=token,
        alumno_id=alumno.id,
        nombre=persona.nombre,
        apellido=persona.apellido,
        email=persona.email,
        mensaje="Login exitoso"
    )
