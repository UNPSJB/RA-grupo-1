from pydantic import BaseModel
<<<<<<< HEAD
=======
from pydantic import BaseModel
from datetime import date
>>>>>>> 36acc76b4cd641a710ecc46f4ba0eb0e155d4010
from typing import List, Optional
from src.pregunta_informe_sintetico.schemas import PreguntaInformeSintetico

class InformeSintetico(BaseModel):
    titulo: str
<<<<<<< HEAD
    descripcion: Optional[str] = None
=======
    contenido: str            
    carrera_id: Optional[int] = None
    fecha: date
>>>>>>> 36acc76b4cd641a710ecc46f4ba0eb0e155d4010

class InformeSinteticoCreate(InformeSintetico):
    pass

class InformeSintetico(InformeSintetico):
    id: int
    preguntas: List[PreguntaInformeSintetico] = []

    class Config:
        orm_mode = True
