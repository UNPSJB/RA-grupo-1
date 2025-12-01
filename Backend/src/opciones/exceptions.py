from src.exceptions import NotFound
from src.preguntas.constants import ErrorMessages
from src.opciones.constants import ErrorMessage

class OpcionNoEncontrada(NotFound):
    DETAIL = ErrorMessages.OPCION_NO_ENCONTRADA

class OpcionSuprimible(NotFound):
    DETAIL = ErrorMessage.OPCION_INMODIFICABLE

class TextoOpcionVacioError(ValueError):
    pass

class TextoOpcionDemasiadoLargoError(ValueError):
    pass