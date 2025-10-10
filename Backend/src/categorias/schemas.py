from pydantic import BaseModel, field_validator, Field
from src.categorias import exceptions
from typing import List, Optional
from src.opciones.models import Opcion

class CategoriaBase(BaseModel):
    cod: str
    texto: str
    encuesta_id: int

class Categoria(CategoriaBase):
    id: int

class CategoriaCreate(CategoriaBase):
    pass