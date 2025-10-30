from fastapi import HTTPException, status
from src.asignaturas.constants import ErrorCode

class AsignaturaNoEncontrada(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorCode.ASIGNATURA_NO_ENCONTRADA
        )

class AsignaturaYaExiste(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=ErrorCode.ASIGNATURA_YA_EXISTE
        )

class DatosAsignaturaInvalidos(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.DATOS_INVALIDOS
        )