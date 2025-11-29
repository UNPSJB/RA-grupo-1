import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Annotated, Dict, Any, Union
from jwt.exceptions import InvalidTokenError
from src.exceptions import PermissionDenied
from src.database import get_db
from src.settings import REFRESH_TOKEN_COOKIE_NAME, TOKEN_URL, SECRET_KEY, ALGORITHM
from src.auth.schemas import TokenData
from src.auth.utils import _is_valid_refresh_token, parse_refresh_token
from src.auth import exceptions 
from src.users import service as users_service
from src.users import models as users_models
from src.users import schemas as users_schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=TOKEN_URL)


def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)

    if not token:
        raise exceptions.NotAuthenticated()
    return token


async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(get_token_from_cookie),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_str = payload.get("sub")
        if user_str is None:
            raise exceptions.InvalidCredentials()
        user = users_schemas.User.model_validate_json(user_str)
        token_data = TokenData(username=user.username)
    except InvalidTokenError:
        raise exceptions.NotAuthenticated()
    user = users_service.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise exceptions.InvalidCredentials()
    return user


async def valid_refresh_token(
    refresh_token: str,
) -> Dict[str, Any]:
    parsed_token = parse_refresh_token(refresh_token)

    if not _is_valid_refresh_token(parsed_token.expires_at):
        raise exceptions.RefreshTokenNotValid()

    return parsed_token


async def valid_refresh_token_user(
    refresh_token: Dict[str, Any] = Depends(valid_refresh_token),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    user = users_service.get_user(db, refresh_token.user_id)
    if not user:
        raise exceptions.RefreshTokenNotValid()

    return user


async def has_role(
    role_name: str,
    db: Session = Depends(get_db),
    user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:
    role = db.scalar(
        select(users_models.Role).where(users_models.Role.name == role_name)
    )
    if role and user.role_id == role.id:
        return user
    raise PermissionDenied()


async def has_admin_role(
    db: Session = Depends(get_db),
    user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:
    return await has_role("admin", db, user)


async def tiene_rol_alumno(
    db: Session = Depends(get_db),
    user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:
    return await has_role("alumno", db, user)

async def tiene_rol_docente(
    db: Session = Depends(get_db),
    user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:
    return await has_role("docente", db, user)

async def tiene_rol_departamento(
    db: Session = Depends(get_db),
    user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:
    return await has_role("departamento", db, user)

async def tiene_rol_secretaria(
    db: Session = Depends(get_db),
    user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:
    return await has_role("secretaria_academica", db, user)


async def has_access_to_user(
    user_id: int,
    auth_user: users_schemas.User = Depends(get_current_user),
) -> users_schemas.User:

    if auth_user.is_admin or int(user_id) == auth_user.id:
        return user_id
    raise PermissionDenied()