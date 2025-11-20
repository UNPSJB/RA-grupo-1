from src.pregunta_informe_sintetico.constants import ErrorCode
from src.exceptions import NotFound

class PreguntaInformeSinteticoNoEncontrada(NotFound):
    DETAIL = ErrorCode.PREGUNTA_SINTETICO_NO_ENCONTRADA