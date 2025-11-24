from pydantic import BaseModel

class DepartamentoBase(BaseModel):
    nombre: str
    sede: str               
    profesor_a_cargo: str | None = None    

class Departamento(DepartamentoBase):
    id: int

    model_config = {"from_attributes": True}
