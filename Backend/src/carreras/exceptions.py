from src.carreras.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class CarreraNoEncontrada(NotFound):
    DETAIL = ErrorCode.CARRERA_NO_ENCONTRADA