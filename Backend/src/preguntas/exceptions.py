from fastapi import HTTPException, status
from src.preguntas.constants import ErrorMessages

class PreguntaNoEncontrada(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail or ErrorMessages.PREGUNTA_NO_ENCONTRADA
        )

class PreguntaSinOpciones(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail or ErrorMessages.OPCION_NO_ENCONTRADA
        )

class OperacionNoPermitida(HTTPException):
    def __init__(self, detail: str = "Operación no permitida"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )