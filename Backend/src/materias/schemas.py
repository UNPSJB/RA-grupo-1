from pydantic import BaseModel

class MateriaBase(BaseModel):
    docente_id: int #tendria que ser un listado de docentes
    nombre: str
    codigo_materia: str

class MateriaCreate(MateriaBase):
    pass

class MateriaUpdate(MateriaBase):
    pass

class Materia(MateriaBase):
    id: int
    model_config = {"from_attributes": True}