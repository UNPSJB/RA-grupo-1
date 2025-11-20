from src.respuestas_informe.constants import ErrorCode
from src.exceptions import NotFound

class RespuestaInformeNoEncontrada(NotFound):
    DETAIL = ErrorCode.RESPUESTA_INFORME_NO_ENCONTRADA