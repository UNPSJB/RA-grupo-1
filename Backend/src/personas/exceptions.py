from src.personas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class PersonaNoEncontrada(NotFound):
    DETAIL = ErrorCode.PERSONA_NO_ENCONTRADA

class PersonaDuplicada(BadRequest):
    DETAIL = ErrorCode.PERSONA_DUPLICADA

class EmailDuplicado(BadRequest):
    DETAIL = ErrorCode.EMAIL_DUPLICADO

class PersonaConRelaciones(BadRequest):
    DETAIL = ErrorCode.PERSONA_CON_RELACIONES