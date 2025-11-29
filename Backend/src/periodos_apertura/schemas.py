from pydantic import BaseModel
from src.vinculaciones.models import Duracion
import datetime

class PeriodoAperturaBase(BaseModel):
    anio: int
    duracion: Duracion
    inicio_encuesta: datetime.date
    fin_encuesta: datetime.date
    inicio_informe_catedra: datetime.date
    fin_informe_catedra: datetime.date
    inicio_informe_sintetico: datetime.date
    fin_informe_sintetico: datetime.date

class PeriodoAperturaCreate(PeriodoAperturaBase):
    pass 

class PeriodoApertura(PeriodoAperturaBase):
    id: int

class PeriodoEncuesta(BaseModel):
    inicio_encuesta: datetime.date
    fin_encuesta: datetime.date

class PeriodoInformeCatedra(BaseModel):
    inicio_informe_catedra: datetime.date
    fin_informe_catedra: datetime.date

class PeriodoInformeSintetico(BaseModel):
    inicio_informe_sintetico: datetime.date
    fin_informe_sintetico: datetime.date