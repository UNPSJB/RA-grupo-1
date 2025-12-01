from sqlalchemy.orm import Session
from src.informe_catedra.models import InformeCatedra
from src.asignaturas.models import Asignatura
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente


def obtener_informes_pendientes_por_docente(db: Session, docente_id: int):
    return (
        db.query(InformeCatedra)
        .join(Asignatura)
        .join(AsignaturaDocente, AsignaturaDocente.asignatura_id == Asignatura.id)
        .filter(AsignaturaDocente.docente_id == docente_id)
        .filter(InformeCatedra.estado == "pendiente")
        .all()
    )
