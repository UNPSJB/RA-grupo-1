from pydantic import BaseModel

class SedeBase(BaseModel):
    nombre: str

class SedeCreate(SedeBase):
    pass

class Sede(SedeBase):
    id: int

    class Config:
        from_attributes = True