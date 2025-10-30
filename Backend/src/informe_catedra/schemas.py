from pydantic import BaseModel
from typing import List, Optional
from src.asignaturas.schemas import Asignatura
from src.informe_catedra_finalizado.schemas import InformeCatedraFinalizado
from src.categorias.schemas import Categoria as CategoriaBase
from src.preguntas.schemas import PreguntaCerrada

class InformeCatedraBase(BaseModel):
    titulo: str

class InformeCatedra(InformeCatedraBase):
    id: int
    informes_finalizados: List[InformeCatedraFinalizado] 
    categorias: List[CategoriaBase]  

    class Config:
        from_attributes = True

class InformeCatedraCreate(InformeCatedraBase):
    pass

# Obtiene una lista de preguntas
class CategoriaConPreguntas(CategoriaBase):
    preguntas: List[PreguntaCerrada] = [] 

    class Config:
        from_attributes = True