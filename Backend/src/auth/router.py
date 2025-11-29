from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.database import get_db
from src.users import services as user_service
from src.auth import utils as auth_utils

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
    # 1) Buscar usuario por username (tu service ya tiene get_user_by_username)
    try:
        user = user_service.get_user_by_username(db, payload.username)
    except Exception as e:
        # devuelve UserNotFound encapsulado en service
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # 2) Verificar password
    if not auth_utils.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    # 3) Generar token JWT (payload mínimo: sub=username, user_id, role)
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
