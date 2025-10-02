from src.models import ModeloBase
from src.personas.models import Persona
from src.roles.models import Rol
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.asignaturas.models import Asignatura
from src.encuestas.models import Encuesta  
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente

__all__ = [
    "ModeloBase",
    "Persona",
    "Rol",
    "Alumno",
    "Docente",
    "Asignatura",
    "Encuesta",
    "EncuestaAlumno",
    "AsignaturaDocente"
]