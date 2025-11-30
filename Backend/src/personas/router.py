from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.database import get_db
from src.personas import services, schemas
from src.personas.exceptions import PersonaDuplicada, PersonaNoEncontrada
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.docentes.models import Docente

router = APIRouter(prefix="/personas", tags=["personas"])


# ===============================
# CRUD PERSONA
# ===============================
@router.post("/", response_model=schemas.Persona)
def create_persona(persona: schemas.PersonaCreate, db: Session = Depends(get_db)):
    try:
        return services.crear_persona(db, persona)
    except PersonaDuplicada as e:
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


# =====================================
# REGISTRO ALUMNO
# =====================================
@router.post("/registro-alumno")
def registrar_alumno(data: dict, db: Session = Depends(get_db)):

    existe_usuario = db.scalar(select(Alumno).where(Alumno.usuario == data["usuario"]))
    if existe_usuario:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")

    existe_email = db.scalar(select(Persona).where(Persona.email == data["email"]))
    if existe_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    existe_dni = db.scalar(select(Persona).where(Persona.dni == data["dni"]))
    if existe_dni:
        raise HTTPException(status_code=400, detail="El DNI ya está registrado")

    persona_payload = schemas.PersonaCreate(
        nombre=data["nombre"],
        apellido=data["apellido"],
        email=data["email"],
        dni=data["dni"],
        legajo=None,
        rol_id=2,  # ALUMNO
        CUIL=data["CUIL"],
        usuario=data["usuario"],
        clave=data["clave"]
    )

    persona = services.crear_persona(db, persona_payload)

    return {
        "message": "Alumno registrado correctamente",
        "alumno_id": persona.alumno.id,
        "persona_id": persona.id
    }


# =====================================
# REGISTRO DOCENTE
# =====================================
@router.post("/registro-docente")
def registrar_docente(data: dict, db: Session = Depends(get_db)):

    # Validar usuario duplicado
    existe_usuario = db.scalar(
        select(Docente).where(Docente.usuario == data.get("usuario"))
    )
    if existe_usuario:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")

    # Validar email duplicado
    existe_email = db.scalar(
        select(Persona).where(Persona.email == data.get("email"))
    )
    if existe_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # Validar DNI duplicado
    existe_dni = db.scalar(
        select(Persona).where(Persona.dni == data.get("dni"))
    )
    if existe_dni:
        raise HTTPException(status_code=400, detail="El DNI ya está registrado")

    try:
        # 1️⃣ Crear PERSONA con rol docente
        persona_payload = schemas.PersonaCreate(
            nombre=data["nombre"],
            apellido=data["apellido"],
            email=data["email"],
            dni=data["dni"],
            rol_id=1,        # DOCENTE
            legajo=int(data["legajo"]),
            CUIL=data["CUIL"],
            usuario=data["usuario"],
            clave=data["clave"]
        )

        persona = services.crear_persona(db, persona_payload)

        # 2️⃣ Crear DOCENTE vinculado a esa persona
        nuevo_docente = Docente(
            persona_id=persona.id,
            usuario=data["usuario"],
            clave=data["clave"]
        )

        db.add(nuevo_docente)
        db.commit()
        db.refresh(nuevo_docente)

        return {
            "message": "Docente registrado correctamente",
            "docente_id": nuevo_docente.id,
            "persona_id": persona.id,
            "nombre": persona.nombre,
            "apellido": persona.apellido,
            "email": persona.email
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al registrar docente: {str(e)}")


