from pydantic import BaseModel, field_validator, Field, ConfigDict
from src.categorias import exceptions
from typing import List, Optional
from src import Opcion
from src.preguntas.schemas import PreguntaParaEstudiante

class CategoriaBase(BaseModel):
    codigo: str
    texto: str

class Categoria(CategoriaBase):
    id: int

class CategoriaEncuesta(Categoria):
    encuesta_id: int

class CategoriaInformeBase(Categoria):
    informe_catedra_id: int
       
class CategoriaEncuestaCreate(CategoriaBase):
    encuesta_id: int

class CategoriaInformeBaseCreate(CategoriaBase):
    informe_catedra_id: int

class CategoriaCreate(CategoriaBase):
    encuesta_id: Optional[int] = None

class CategoriaConPreguntas(Categoria):
    id: int
    texto: str
    codigo: str
    preguntas: List[PreguntaParaEstudiante]

    model_config = ConfigDict(from_attributes=True)
