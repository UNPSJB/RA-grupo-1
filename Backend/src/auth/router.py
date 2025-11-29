from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.database import get_db
from src.users import services as user_service
from src.auth import utils as auth_utils
from src.auth.register_schemas import RegisterRequest, RegisterResponse
from src.auth import register_service

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    alumno_id: int | None = None
    docente_id: int | None = None
    departamento_id: int | None = None
    username: str
    email: str


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = user_service.get_user_by_username(db, payload.username)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    if not auth_utils.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token_data = {
        "sub": user.username,
        "user_id": user.id,
        "role": user.role.name if user.role else None,
    }
    access_token = auth_utils.create_access_token(token_data)

    return LoginResponse(
        access_token=access_token,
        user_id=user.id,
        role=user.role.name if user.role else "user",
        alumno_id=user.alumno_id,
        docente_id=user.docente_id,
        departamento_id=user.departamento_id,
        username=user.username,
        email=user.email,
    )

@router.post("/register", response_model=RegisterResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Endpoint único de registro que maneja todos los roles.
    El campo 'role_type' determina qué tipo de usuario crear.
    """
    return register_service.register_user(db, data)