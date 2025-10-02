from typing import List
from src.asignaturas.constantes import ErrorCode
from src.exceptions import NotFound, BadRequest

class AsignaturaNoEncontrada(NotFound):
    DETAIL = ErrorCode.ASIGNATURA_NO_ENCONTRADA