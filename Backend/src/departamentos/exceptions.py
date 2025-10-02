from src.departamentos.constants import ErrorCode
from src.exceptions import NotFound

class DepartamentoNoEncontrado(NotFound):
    DETAIL = ErrorCode.DEPARTAMENTO_NO_ENCONTRADO