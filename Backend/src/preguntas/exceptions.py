from typing import List
from src.exceptions import NotFound, BadRequest
from src.preguntas.constants import ErrorMessages

class PreguntaNoEncontrada(NotFound):
    DETAIL = ErrorMessages.PREGUNTA_NO_ENCONTRADA

class PreguntaSinOpciones(NotFound):
    DETAIL = ErrorMessages.OPCION_NO_ENCONTRADA