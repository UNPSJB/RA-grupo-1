from pydantic import BaseModel, ConfigDict
from typing import List

class OpcionPorcentaje(BaseModel):
    opcion_id: str
    porcentaje: float
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
class IndicadoresPregunta(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    id_pregunta: str
    indicadores: List[OpcionPorcentaje]

class IndicadoresCategoria(BaseModel):
    categoria_codigo: str
    categoria_texto: str
    promedio_categoria: List[OpcionPorcentaje]
    preguntas: List[IndicadoresPregunta]