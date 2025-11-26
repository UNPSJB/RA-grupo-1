from src.alumnos.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class AlumnoNoEncontrado(NotFound):
    DETAIL = ErrorCode.ALUMNO_NO_ENCONTRADO

class NombreDuplicado(BadRequest):
    DETAIL = ErrorCode.NOMBRE_DUPLICADO

class PersonaNoEncontrada(NotFound):
    DETAIL = "La persona asociada no existe."

class CUILDuplicado(BadRequest):
    DETAIL = "El CUIL ya está registrado."

class AsignaturaNoEncontrada(NotFound):
    DETAIL = "La asignatura indicada no existe."

class AlumnoYaInscrito(BadRequest):
    DETAIL = "El alumno ya está inscripto en esta asignatura."
