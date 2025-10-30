from src.encuesta_finalizada.constants import ErrorCode
from src.exceptions import NotFound

class EncuestaFinalizadaNoEncontrada(NotFound):
    DETAIL = ErrorCode.ENCUESTA_FINALIZADA_NO_ENCONTRADA