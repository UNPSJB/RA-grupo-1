from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException
from datetime import date
import traceback

from src.auth.register_schemas import RegisterRequest, RegisterResponse
from src.auth.utils import get_password_hash
from src.users.models import User, Role
from src.personas.models import Persona
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.departamentos.models import Departamento


def register_user(db: Session, data: RegisterRequest) -> RegisterResponse:
    """
    Servicio único de registro que maneja los 4 roles según role_type
    """
    
    try:
        # 1. Verificar username único
        existing_user = db.scalar(select(User).where(User.username == data.username))
        if existing_user:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
        
        # 2. Verificar email único
        existing_email = db.scalar(select(User).where(User.email == data.email))
        if existing_email:
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        
        # 3. Obtener el rol
        role_map = {
            "alumno": "alumno",
            "docente": "docente",
            "departamento": "departamento",
            "secretaria": "secretaria_academica"
        }
        
        role_name = role_map.get(data.role_type)
        if not role_name:
            raise HTTPException(status_code=400, detail=f"Tipo de rol inválido: {data.role_type}")
        
        role = db.scalar(select(Role).where(Role.name == role_name))
        if not role:
            raise HTTPException(
                status_code=500, 
                detail=f"Rol '{role_name}' no encontrado en el sistema. Contacta al administrador."
            )
        
        # 4. Crear Persona
        persona_data = {
            "nombre": data.nombre,
            "apellido": data.apellido,
            "email": data.email,
            "dni": data.dni,
            "rol_id": role.id,
            "fecha_creacion": date.today()
        }
        
        # Agregar legajo solo si existe
        if hasattr(data, 'legajo') and data.legajo is not None:
            persona_data["legajo"] = data.legajo
        
        persona = Persona(**persona_data)
        db.add(persona)
        db.flush()  # Para obtener el ID sin hacer commit
        
        # 5. Crear entidad específica según rol
        alumno_id = None
        docente_id = None
        departamento_id = None
        
        if data.role_type == "alumno":
            if not data.CUIL:
                raise HTTPException(status_code=400, detail="CUIL es requerido para alumnos")
            
            alumno = Alumno(
                persona_id=persona.id,
                CUIL=data.CUIL,
                fecha_creacion=date.today()
            )
            db.add(alumno)
            db.flush()
            alumno_id = alumno.id
            
        elif data.role_type == "docente":
            docente = Docente(persona_id=persona.id)
            db.add(docente)
            db.flush()
            docente_id = docente.id
            
        elif data.role_type == "departamento":
            if not data.departamento_id:
                raise HTTPException(status_code=400, detail="departamento_id es requerido")
                
            dept = db.scalar(select(Departamento).where(Departamento.id == data.departamento_id))
            if not dept:
                raise HTTPException(status_code=404, detail="Departamento no encontrado")
            departamento_id = data.departamento_id
        
        # 6. Crear User
        hashed_password = get_password_hash(data.password)
        
        user = User(
            username=data.username,
            email=data.email,
            hashed_password=hashed_password,
            role_id=role.id,
            alumno_id=alumno_id,
            docente_id=docente_id,
            departamento_id=departamento_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return RegisterResponse(
            message=f"Usuario registrado exitosamente como {data.role_type}",
            user_id=user.id,
            username=user.username,
            email=user.email,
            role=role.name,
            alumno_id=alumno_id,
            docente_id=docente_id,
            departamento_id=departamento_id
        )
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print("❌ ERROR EN REGISTRO:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno al registrar usuario: {str(e)}"
        )