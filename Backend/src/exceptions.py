from typing import Any, Dict
from fastapi import HTTPException, status
class DetailedHTTPException(HTTPException):
    STATUS_CODE = status.HTTP_500_INTERNAL_SERVER_ERROR
    DETAIL = "Error del servidor"

    def __init__(self, **kwargs: Dict[str, Any]) -> None:
        super().__init__(status_code=self.STATUS_CODE, detail=self.DETAIL, **kwargs)

class PermissionDenied(DetailedHTTPException):
    STATUS_CODE = status.HTTP_403_FORBIDDEN
    DETAIL = "Permiso denegado"

class NotFound(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class BadRequest(HTTPException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class Conflict(HTTPException):
    def __init__(self, detail: str = "Conflict"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)

class UnprocessableEntity(DetailedHTTPException):
    STATUS_CODE = status.HTTP_422_UNPROCESSABLE_ENTITY
    DETAIL = "Entidad no procesable"

class NotAuthenticated(DetailedHTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "Usuario no autorizado"

    def __init__(self) -> None:
        super().__init__(headers={"WWW-Authenticate": "Bearer"})