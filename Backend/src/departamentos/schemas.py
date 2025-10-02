from pydantic import BaseModel

class DepartamentoBase(BaseModel):
    nombre:str

class Departamento(DepartamentoBase):
    id: int

    model_config = {"from_attributes": True}