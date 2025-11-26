from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from src.encuestaCompletada.models import EncuestaCompletada
from src.informe_catedra_completado.models import InformeCatedraCompletado
from src.asociaciones.models import Periodo

def get_anios_disponibles(db: Session) -> List[int]:
    stmt_encuestas = select(EncuestaCompletada.anio).distinct()
    stmt_informes = select(InformeCatedraCompletado.anio).distinct()

    anios_encuestas = db.scalars(stmt_encuestas).all()
    anios_informes = db.scalars(stmt_informes).all()

    anios_set = set(anios_encuestas) | set(anios_informes)

    return sorted(list(anios_set), reverse=True)


def get_periodos_disponibles(db: Session) -> List[str]:
    return [p.value for p in Periodo]