from src.resultado_informe.constants import ErrorCode
from src.exceptions import NotFound

class RespuestaInformeNoEncontrada(NotFound):
    DETAIL = ErrorCode.RESULTADO_INFORME_NO_ENCONTRADA