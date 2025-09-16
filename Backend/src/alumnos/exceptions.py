from src.alumnos.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class AlumnoNoEncontrado(NotFound):
    DETAIL = ErrorCode.ALUMNO_NO_ENCONTRADO


class NombreDuplicado(BadRequest):
    DETAIL = ErrorCode.NOMBRE_DUPLICADO

