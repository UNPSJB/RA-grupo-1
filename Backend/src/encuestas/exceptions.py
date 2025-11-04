from fastapi import HTTPException, status
from src.encuestas.constants import ErrorCode

class EncuestaNoEncontrada(HTTPException):
    def __init__(self, detail: str = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail or ErrorCode.ENCUESTA_NO_ENCONTRADA
        )

class FechasEncuestaInvalidas(HTTPException):
    def __init__(self, detail: str = "Las fechas de la encuesta son inválidas"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )

class EncuestaNoDisponible(HTTPException):
    def __init__(self, detail: str = "La encuesta no está disponible en este momento"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )

class EncuestaYaRespondida(HTTPException):
    def __init__(self, detail: str = "Ya has completado esta encuesta"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )