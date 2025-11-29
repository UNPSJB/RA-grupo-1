from sqlalchemy import select
from sqlalchemy.orm import Session
from src.users import models, exceptions

def get_user_by_email(db: Session, email: str) -> models.User:
    user = db.scalar(select(models.User).where(models.User.email == email))
    if not user:
        raise exceptions.UserNotFound()
    return user