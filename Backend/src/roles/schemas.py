from pydantic import BaseModel, field_validator

class RolBase(BaseModel):
    id: int
    nombre: str

class Rol(RolBase):
    model_config = {"from_attributes": True}