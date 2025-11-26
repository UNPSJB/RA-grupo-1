from pydantic import BaseModel
from typing import Optional

class CarreraBase(BaseModel):
    nombre: str
    departamento_id: int

class Carrera(CarreraBase):
    id: int
    informes_base_id: Optional[int] = None   # probar

    model_config = {"from_attributes": True}
