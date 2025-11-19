from pydantic import BaseModel

class CarreraBase(BaseModel):
    nombre: str
    departamento_id: int

class Carrera(CarreraBase):
    id: int

    model_config = {"from_attributes": True}