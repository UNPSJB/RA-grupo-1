from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from src.sedes.models import Sede 

def get_sedes(db: Session) -> List[Sede]:
    return db.scalars(select(Sede)).all()