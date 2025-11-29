from src.periodos_apertura.constants import ErrorCode
from src.exceptions import NotFound

class PeriodoAperturaNoEncontrado(NotFound):
    DETAIL = ErrorCode.PERIODO_APERTURA_NO_ENCONTRADO