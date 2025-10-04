from pydantic import BaseModel
from typing import List
from enum import Enum
from datetime import datetime
from src.encuestas.models import EstadoEncuesta
from src.vinculaciones.models import Duracion

# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class EncuestaBase(BaseModel):
    año: int
    estado: EstadoEncuesta
    cursado: Duracion
    fecha_inicio: datetime
    fecha_fin: datetime
    carrera: str
    sede: str
    titulo: str
    activa: bool
    created_at: datetime
    asignatura_id: int
    
class EncuestaCreate(EncuestaBase):
    pass


class EncuestaUpdate(EncuestaBase):
    pass


class Encuesta(EncuestaBase):
    id: int

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}
