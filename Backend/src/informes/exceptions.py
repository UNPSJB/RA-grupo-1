from src.informes.constants import ErrorCode
from src.exceptions import NotFound

class InformeNoEncontrado(NotFound):
    DETAIL = ErrorCode.INFORME_NO_ENCONTRADO