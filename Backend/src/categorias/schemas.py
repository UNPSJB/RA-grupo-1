from pydantic import BaseModel, field_validator, Field
from src.categorias import exceptions
from typing import List, Optional
from src import Opcion

class CategoriaBase(BaseModel):
    codigo: str
    texto: str

class Categoria(CategoriaBase):
    id: int

class CategoriaEncuesta(Categoria):
    encuesta_id: int

class CategoriaInformeBase(Categoria):
    informe_base_id: int
       
class CategoriaEncuestaCreate(CategoriaBase):
    encuesta_id: int

class CategoriaInformeBaseCreate(CategoriaBase):
    informe_base_id: int