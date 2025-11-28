import jwt
import datetime
from fastapi import Depends
from typing import Union
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from src.auth.utils import verify_password
from src.auth.schemas import (
    ForgotPasswordData, 
    ForgotPasswordEmailSent,
    PasswordResetData,
    PasswordUpdated,
    PasswordUpdateData
)
from src.database import get_db
from src.auth import constants, utils, exceptions
from src.auth.models import AuthPasswordRecoveryToken as RecoveryToken
from src.users.service import (
    get_user,
    get_user_by_username, 
    update_user, 
    check_invalid_password
)
from src.users import exceptions as user_exceptions
from src.users import schemas as users_schemas
from src.settings import (
    MAIN_SITE_DOMAIN, 
    REFRESH_TOKEN_EXPIRE_DAYS,
    SECRET_KEY,
    ALGORITHM
)
from src.users.utils import get_user_by_email


def authenticate_user(username: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not verify_password(password, user.hashed_password):
        raise exceptions.IncorrectUserOrPassword()
    return user


def expire_invalid_recovery_tokens(db: Session, email: str):
    db.execute(
        delete(RecoveryToken).where(
            RecoveryToken.email == email,
            RecoveryToken.expires_at < datetime.datetime.now(datetime.UTC),
        )
    )
    db.commit()


def get_most_recent_valid_recovery_token(
    db: Session, email: str
) -> Union[RecoveryToken, None]:
    return db.scalar(
        select(RecoveryToken)
        .where(
            RecoveryToken.email == email,
            RecoveryToken.expires_at > datetime.datetime.now(datetime.UTC),
        )
        .order_by(RecoveryToken.expires_at.desc())
    )


def create_recovery_token(db: Session, user: users_schemas.User) -> RecoveryToken:
    # Expiring invalid tokens first
    expire_invalid_recovery_tokens(db, user.username)

    # Checking and retrieving existing valid recovery token
    existing_recovery_token = get_most_recent_valid_recovery_token(db, user.username)
    if existing_recovery_token:
        return existing_recovery_token

    # Creating a new recovery token if none exists
    expiration_date = datetime.datetime.now(datetime.UTC) + datetime.timedelta(
        minutes=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60)

    recovery_token = jwt.encode(
        {"user_id": user.id, "email": user.email, "exp": expiration_date},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    db_recovery_token = RecoveryToken(
        email=user.email, recovery_token=recovery_token, expires_at=expiration_date
    )

    db.add(db_recovery_token)
    db.commit()
    db.refresh(db_recovery_token)

    return db_recovery_token


def send_password_recovery_email(
    db: Session, forgot_password_data: ForgotPasswordData
) -> ForgotPasswordEmailSent:
    try:
        user = get_user_by_email(db, forgot_password_data.email)
    except user_exceptions.UserNotFound:
        message = constants.Message.EMAIL_SENT_MSG.substitute(
            {"email": forgot_password_data.email}
        )
        return ForgotPasswordEmailSent(msg=message, url=None)

    recovery_token_obj = create_recovery_token(db, user)
    recovery_url = f"{MAIN_SITE_DOMAIN}/password-recovery?token={recovery_token_obj.recovery_token}"
    print(recovery_token_obj.recovery_token)
    
    email_message = constants.Message.PASSWORD_RECOVERY_EMAIL_BODY.substitute(
        {"recovery_url": recovery_url}
    )
    #utils.send_email(forgot_password_data.email, email_message)
    message = constants.Message.EMAIL_SENT_MSG.substitute({"email": user.email})
    return ForgotPasswordEmailSent(msg=message, url=recovery_url)


def update_user_password(
    db: Session, token: str, password_update_data: PasswordUpdateData
) -> users_schemas.User:
    user = utils.get_user_password_update_token(token, db)
    new_user = update_user(
        db, user, users_schemas.UserUpdate(password=password_update_data.new_password)
    )
    db.execute(
        delete(RecoveryToken).where(
            RecoveryToken.email == user.email
        )
    )
    db.commit()
    return PasswordUpdated(msg=constants.Message.PASSWORD_UPDATED_MSG)


def reset_user_password(
    db: Session, user, password_reset_data: PasswordResetData
):
    if not password_reset_data.user_id:
        auth_user = authenticate_user(user.username, password_reset_data.password, db)
        if auth_user:
            new_user = update_user(
                db, user, users_schemas.UserUpdate(password=password_reset_data.new_password)
            )
            db.commit()
            return PasswordUpdated(msg=constants.Message.PASSWORD_UPDATED_MSG)
        else:
            raise exceptions.IncorrectUserOrPassword()
    else:
        user = get_user(db, password_reset_data.user_id)
        check_invalid_password(password_reset_data.new_password)
        new_user = update_user(
            db, user, users_schemas.UserUpdate(password=password_reset_data.new_password)
        )
        db.commit()
        return PasswordUpdated(msg=constants.Message.PASSWORD_UPDATED_MSG)