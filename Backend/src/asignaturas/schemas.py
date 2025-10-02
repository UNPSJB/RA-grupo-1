from pydantic import BaseModel, field_serializer
from typing import List
from typing import Optional, List
class AsignaturaBase(BaseModel):
    nombre: str
    matricula: str
    docente_id: Optional[int] = None  
    model_config= {
        "json_schema_extra":{
            "example":{
                "nombre": "Sistemas y organizaciones",
                "matricula": "FA02",
            }
        }
    }


class Asignatura(AsignaturaBase):
       id: int

       model_config = {"from_attributes": True}