from pydantic import BaseModel, field_validator
from typing import List

class DocenteBase(BaseModel):
    nombre: str
    apellido: str
    model_config= {
        "jason_schema_extra":{
            "example":{  
                "nombre": "Leonardo",
                "apellido": "Ordoñiez",
        }
    }
}

class Docente(DocenteBase):
    id: int
    model_config = {"from_attributes": True}