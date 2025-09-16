class ErrorCode:
    ENCUESTA_NO_ENCONTRADA = "La encuesta no se encontró."
    ALUMNO_NO_ENCONTRADO = "El alumno no se encontró."
    ENCUESTA_NO_COMPLETADA = "La encuesta no está completada."
    ENCUESTA_DUPLICADA = "El alumno ya tiene una encuesta completada para esta materia."
    MATERIA_NO_ENCONTRADA = "La materia no se encontró."
    SIN_ENCUESTAS_COMPLETADAS = "El alumno no tiene encuestas completadas."

class EstadoEncuesta:
    PENDIENTE = "pendiente"
    EN_PROGRESO = "en_progreso" 
    COMPLETADA = "completada"