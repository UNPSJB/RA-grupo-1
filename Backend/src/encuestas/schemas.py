from pydantic import BaseModel
from typing import List
from enum import Enum
from src.encuestas.models import EstadoEncuesta, Cursado

# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class EncuestaBase(BaseModel):
    asignatura: str
    año: int
    estado: EstadoEncuesta
    cursado: Cursado
    fecha_inicio: str
    fecha_fin: str
    carrera: str
    sede: str
    
class EncuestaCreate(EncuestaBase):
    pass


class EncuestaUpdate(EncuestaBase):
    pass


class Encuesta(EncuestaBase):
    id: int

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}
