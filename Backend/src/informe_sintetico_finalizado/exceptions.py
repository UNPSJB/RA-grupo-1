from fastapi import HTTPException
from .constants import ErrorCode

class InformeNoEncontrado(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail=ErrorCode.INFORME_NO_ENCONTRADO)