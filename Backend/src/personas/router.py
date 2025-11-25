from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select 
from src.database import get_db
from src.personas import services, schemas
from src.personas.exceptions import PersonaNoEncontrada, PersonaDuplicada


from src.personas.models import Persona
from src.alumnos.models import Alumno  
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

@router.post("/registro")
def registrar_alumno(data: dict, db: Session = Depends(get_db)):
    """
    Endpoint para registrar un nuevo alumno.
    Crea tanto la persona como el alumno en una sola operación.
    """
    
    # 1) Validar usuario repetido
    existe_usuario = db.execute(
        select(Alumno).where(Alumno.usuario == data.get("usuario"))
    ).first()

    if existe_usuario:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")

    # 2) Validar email repetido
    existe_email = db.execute(
        select(Persona).where(Persona.email == data.get("email"))
    ).first()

    if existe_email:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # 3) Validar DNI repetido
    existe_dni = db.execute(
        select(Persona).where(Persona.dni == data.get("dni"))
    ).first()

    if existe_dni:
        raise HTTPException(status_code=400, detail="El DNI ya está registrado")

    # 4) Crear usando el servicio existente
    try:
        persona_payload = schemas.PersonaCreate(
            nombre=data["nombre"],
            apellido=data["apellido"],
            email=data["email"],
            dni=data["dni"],
            rol_id=2,  # 2 = alumno
            legajo=int(data["legajo"]),
            CUIL=data["CUIL"],
            usuario=data["usuario"],
            clave=data["clave"]
        )

        persona = services.crear_persona(db, persona_payload)

        return {
            "message": "Alumno registrado correctamente",
            "alumno_id": persona.alumno.id if persona.alumno else None,
            "persona_id": persona.id,
            "nombre": persona.nombre,
            "apellido": persona.apellido
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al registrar alumno: {str(e)}")