from src.encuestas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class EncuestaNoEncontrada(NotFound):
    DETAIL = ErrorCode.ENCUESTA_NO_ENCONTRADA

# En src/encuestas/exceptions.py
class FechasEncuestaInvalidas(Exception):
    pass

class EncuestaNoDisponible(Exception):
    pass

class EncuestaYaRespondida(Exception):
    pass