import jwt
import datetime
from jwt.exceptions import InvalidTokenError
from fastapi import Depends
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Optional
from src.settings import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from src.database import get_db
from src.auth import schemas, exceptions
from src.auth.models import AuthPasswordRecoveryToken as RecoveryToken
from src.users import models as users_models
from src.users import schemas as users_schemas
from src.users import utils as users_utils

password_hash = PasswordHash.recommended()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def encode_access_token(
        data: dict, 
        expires_delta_minutes: Optional[int] = 15):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=expires_delta_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, SECRET_KEY, algorithm=ALGORITHM
    )
    return encoded_jwt


def create_access_token(
    user: users_models.User,
    expiration_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES
):
    serialized_user = users_schemas.User.model_validate(user).model_dump_json()
    access_token = encode_access_token(
        data={"sub": serialized_user},
        expires_delta_minutes=expiration_minutes,
    )
    return access_token


async def create_refresh_token(
    db: Session,
    user_id: int
) -> str:
    user = db.query(users_models.User).filter(users_models.User.id == user_id).first()
    expiration_minutes = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60
    refresh_token = create_access_token(user=user, expiration_minutes=expiration_minutes)
    return refresh_token


def parse_refresh_token(refresh_token: str) -> schemas.RefreshToken:
    payload = jwt.decode(
        refresh_token, SECRET_KEY, algorithms=[ALGORITHM]
    )
    user = users_schemas.User.model_validate_json(payload.get("sub"))
    user_id = user.id
    expires_at = datetime.datetime.fromtimestamp(payload.get("exp"))
    valid = _is_valid_refresh_token(expires_at)

    return schemas.RefreshToken(
        user_id=user_id,
        expires_at=expires_at,
        valid=valid,
        refresh_token=refresh_token,
    )


def _is_valid_refresh_token(expires_at: datetime) -> bool:
    return datetime.datetime.now(datetime.UTC) <= expires_at.astimezone(datetime.UTC)


def get_user_password_update_token(
    token: str,
    db: Session = Depends(get_db),
) -> None:
    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        import pdb; pdb.set_trace()
        recovery_token_obj = db.scalar(
            select(RecoveryToken).where(RecoveryToken.recovery_token == token)
        )
        if not recovery_token_obj:
            raise exceptions.InvalidPasswordUpdateToken()

        user = users_utils.get_user_by_email(db, email=payload.get("email"))
        if (
            payload.get("email") != recovery_token_obj.email
            or payload.get("user_id") != user.id
        ):
            raise exceptions.InvalidPasswordUpdateToken()
        return user
    except InvalidTokenError:
        raise exceptions.InvalidPasswordUpdateToken()