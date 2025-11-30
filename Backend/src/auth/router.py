from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.database import get_db
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.auth.schemas import LoginRequest
import logging

router = APIRouter(prefix="/auth")


# =============================
#  LOGIN ALUMNO (tu código)
# =============================
@router.post("/login")
def login(credentials: LoginRequest, session: Session = Depends(get_db)):

    logging.info(f"🔐 Intento de login ALUMNO: {credentials.usuario}")

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

    token = f"TOKEN-ALUMNO-{alumno.id}"

    return {
        "token": token,
        "alumno_id": alumno.id,
        "nombre": persona.nombre,
        "apellido": persona.apellido,
        "email": persona.email
    }



# =============================
#  LOGIN DOCENTE (nuevo)
# =============================
@router.post("/login-docente")
def login_docente(credentials: LoginRequest, session: Session = Depends(get_db)):

    stmt = (
        select(Docente, Persona)
        .join(Persona, Docente.persona_id == Persona.id)
        .where(Docente.usuario == credentials.usuario)
    )

    result = session.execute(stmt).first()

    if not result:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    docente, persona = result

    if docente.clave != credentials.clave:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    return {
        "token": f"TOKEN-DOCENTE-{docente.id}",
        "docente_id": docente.id,
        "nombre": persona.nombre,
        "apellido": persona.apellido,
        "email": persona.email
    }
