from typing import List
from src.exceptions import NotFound, BadRequest
from src.respuestas.constants import ErrorMessages

class RespuestaNoEncontrada(NotFound):
    DETAIL = ErrorMessages.RESPUESTA_NO_ENCONTRADA

class RespuestaException(Exception):
    pass

class EncuestaNoEncontrada(RespuestaException):
    pass

class EncuestaNoActiva(RespuestaException):
    pass

class EncuestaFueraDeFecha(RespuestaException):
    pass

class PreguntaNoEncontrada(RespuestaException):
    pass

class AlumnoNoEncontrado(RespuestaException):
    pass

class RespuestaInvalida(RespuestaException):
    pass

class RespuestaNoEncontrada(RespuestaException):
    pass