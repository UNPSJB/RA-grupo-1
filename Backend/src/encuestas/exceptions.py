from src.encuestas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest, Conflict

class EncuestaNoEncontrada(NotFound):
    DETAIL = ErrorCode.ENCUESTA_NO_ENCONTRADA

class AlumnoNoEncontrado(NotFound):
    DETAIL = ErrorCode.ALUMNO_NO_ENCONTRADO

class EncuestaNoCompletada(BadRequest):
    DETAIL = ErrorCode.ENCUESTA_NO_COMPLETADA

class EncuestaDuplicada(Conflict):
    DETAIL = ErrorCode.ENCUESTA_DUPLICADA

class MateriaNoEncontrada(NotFound):
    DETAIL = ErrorCode.MATERIA_NO_ENCONTRADA

class SinEncuestasCompletadas(NotFound):
    DETAIL = ErrorCode.SIN_ENCUESTAS_COMPLETADAS