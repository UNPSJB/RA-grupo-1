from pydantic import BaseModel

class OpcionBase(BaseModel):
    texto: str

class OpcionCreate(OpcionBase):
    pass

class OpcionUpdate(OpcionBase):
    pass

class OpcionDelete(BaseModel):
    id: int

class Opcion(OpcionBase):
    id: int

    model_config = {
        "from_attributes": True
    } 