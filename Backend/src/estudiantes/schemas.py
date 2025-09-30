from pydantic import BaseModel

class EstudianteBase(BaseModel):
    nombre: str

class EstudianteCreate(EstudianteBase):
    pass

class EstudianteOut(EstudianteBase):
    id: int
    class Config:
        orm_mode = True
