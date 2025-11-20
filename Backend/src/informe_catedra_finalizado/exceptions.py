from src.informe_catedra_finalizado.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class InformeFinalizadoNoEncontrado(NotFound):
    DETAIL = ErrorCode.INFORME_FINALIZADO_NO_ENCONTRADO

class InformeFinalizadoYaExiste(BadRequest):
    DETAIL = ErrorCode.INFORME_FINALIZADO_YA_EXISTE

class InformeContenidoInvalido(BadRequest):
    DETAIL = ErrorCode.INFORME_INVALIDO

class DocenteAsignaturaNoEncontrada(NotFound):
    DETAIL = ErrorCode.DOCENTE_ASIGNATURA_NO_ENCONTRADO