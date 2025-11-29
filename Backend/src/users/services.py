from sqlalchemy import select, update
from sqlalchemy.orm import Session
from typing import Optional
from src.auth.utils import get_password_hash
from src.users import schemas, models, exceptions


def check_user_exists(db: Session, user_id: int):
    user = db.scalars(select(models.User).where(models.User.id == user_id)).first()
    if not user:
        raise exceptions.UserNotFound()


def check_username_exists(db: Session, username: str, user_id: Optional[int] = None):
    user = db.scalars(
        select(models.User).where(models.User.username == username)
    ).first()
    if user:
        if user_id and user_id != user.id:
            raise exceptions.UsernameTaken()
        if not user_id:
            raise exceptions.UsernameTaken()


def check_invalid_password(password: str):
    valid = len(password.strip()) >= 8
    if not valid:
        raise exceptions.UserInvalidPassword()


def get_user(db: Session, user_id: int) -> models.User:
    check_user_exists(db, user_id=user_id)
    user = db.scalars(select(models.User).where(models.User.id == user_id)).first()
    return user


def get_user_by_username(db: Session, username: str) -> models.User:
    user = db.scalars(
        select(models.User).where(models.User.username == username)
    ).first()
    if not user:
        raise exceptions.UserNotFound()
    return user


def get_users(db: Session, auth_user: models.User):
    if auth_user.is_admin:
        return db.scalars(select(models.User))

def create_user(db: Session, user: schemas.UserCreate):
    check_username_exists(db, username=user.username)
    check_invalid_password(password=user.password)

    default_role = (
        db.query(models.Role).filter(models.Role.name == "user").first()
    ) 
    
    hashed_password = get_password_hash(user.password)
    values = user.model_dump()
    values.pop("password")
    db_user = models.User(
        **values,
        hashed_password=hashed_password,
        role_id=default_role.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(
    db: Session,
    db_user: schemas.User,
    updated_user: schemas.UserUpdate,
):
    check_user_exists(db, user_id=db_user.id)
    check_username_exists(db, username=updated_user.username, user_id=db_user.id)

    user = get_user(db, db_user.id)
    values = updated_user.model_dump(exclude_unset=True)

    if updated_user.password:
        check_invalid_password(password=updated_user.password)
        values["hashed_password"] = get_password_hash(
            values["password"]
        )
        values.pop("password")

    db.execute(update(models.User).where(models.User.id == user.id).values(values))
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, db_user: schemas.User):
    check_user_exists(db, user_id=db_user.id)

    db.delete(db_user)
    db.commit()
    return db_user.id


def check_role_exists(db: Session, role_id: int):
    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if not role:
        raise exceptions.RoleNotFound()


def assign_role(db: Session, user_id: int, role_id: int) -> schemas.User:
    check_user_exists(db, user_id)
    check_role_exists(db, role_id)

    user = get_user(db, user_id)
    db.execute(
        update(models.User)
        .where(models.User.id == user.id)
        .values({"role_id": role_id})
    )
    db.commit()
    db.refresh(user)
    return user