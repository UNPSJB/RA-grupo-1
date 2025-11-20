from typing import List
from src.exceptions import NotFound, BadRequest
from src.preguntas.constants import ErrorMessages
from src.opciones.constants import ErrorMessage

class OpcionNoEncontrada(NotFound):
    DETAIL = ErrorMessages.OPCION_NO_ENCONTRADA

class OpcionSuprimible(NotFound):
    DETAIL = ErrorMessage.OPCION_INMODIFICABLE

class TextoOpcionVacioError(ValueError):
    # Cuando el texto de la opción está vacío
    pass

class TextoOpcionDemasiadoLargoError(ValueError):
    # cuando el texto excede el límite
    pass