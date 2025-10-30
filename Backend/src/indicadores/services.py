from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from src.indicadores.models import IndicadoresInforme, IndicadoresPregunta
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.asignaturas.models import Asignatura
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta
from src.opciones.models import Opcion
from src.encuestas.models import Encuesta
from src.vinculaciones.models import Duracion
from src.indicadores import schemas
from src.encuestas import services as encuesta_services
from src.preguntas import schemas as pregunta_schemas

def obtener_indicadores(
    db: Session, 
    id_asignatura: int, 
    anio: int, 
    duracion: Duracion
) -> List[schemas.IndicadoresPregunta]:
    """
    Obtiene los indicadores estadísticos de las preguntas cerradas
    para una asignatura, año y duración específicos.
    """
    # Verificar que la asignatura existe
    asignatura: Optional[Asignatura] = db.scalar(
        select(Asignatura).where(Asignatura.id == id_asignatura)
    )
    
    if not asignatura:
        raise ValueError(f"Asignatura con id {id_asignatura} no encontrada")
    
    # Obtener encuesta asociada a la asignatura
    encuesta: Encuesta = asignatura.encuesta
    if not encuesta:
        return []
    
    # Obtener preguntas cerradas directamente desde la base de datos
    preguntas = db.scalars(
        select(Pregunta)
        .where(Pregunta.encuesta_id == encuesta.id)
        .where(Pregunta.tipo == 'cerrada')  # Ajusta según tu modelo
    ).all()
    
    if not preguntas:
        return []
    
    # Obtener encuestas finalizadas
    encuestas_finalizadas = db.scalars(
        select(EncuestaFinalizada)
        .where(EncuestaFinalizada.asignatura_id == id_asignatura)
        .where(EncuestaFinalizada.anio == anio)
        .where(EncuestaFinalizada.duracion == duracion)
    ).all()
    
    if not encuestas_finalizadas:
        return []
    
    # Obtener respuestas de las encuestas finalizadas
    ids_encuestas = [e.id for e in encuestas_finalizadas]
    respuestas = db.scalars(
        select(Respuesta).where(Respuesta.encuesta_finalizada_id.in_(ids_encuestas))
    ).all()
    
    # Calcular indicadores
    indicadores: List[schemas.IndicadoresPregunta] = []
    total_encuestas = len(encuestas_finalizadas)
    
    for pregunta in preguntas:
        # Obtener opciones para esta pregunta
        opciones = db.scalars(
            select(Opcion).where(Opcion.pregunta_id == pregunta.id)
        ).all()
        
        indicadores_opciones: List[schemas.OpcionPorcentaje] = []
        respuestas_pregunta = [r for r in respuestas if r.pregunta_id == pregunta.id]
        
        for opcion in opciones:
            respuestas_opcion = [r for r in respuestas_pregunta if r.opcion_id == opcion.id]
            cantidad = len(respuestas_opcion)
            porcentaje = (cantidad / total_encuestas * 100) if total_encuestas > 0 else 0
            
            indicadores_opciones.append(
                schemas.OpcionPorcentaje(
                    opcion_id=str(opcion.contenido),
                    porcentaje=round(porcentaje, 2)
                )
            )
        
        indicadores_pregunta = schemas.IndicadoresPregunta(
            id_pregunta=str(pregunta.enunciado),
            indicadores=indicadores_opciones
        )
        indicadores.append(indicadores_pregunta)
        
    return indicadores


def guardar_indicadores(db: Session, id_informe_catedra: int) -> None:
    """
    Guarda los indicadores estadísticos en la base de datos
    para un informe de cátedra finalizado.
    """
    # Verificar que el informe existe
    informe_catedra: Optional[InformeCatedraFinalizado] = db.scalar(
        select(InformeCatedraFinalizado).where(InformeCatedraFinalizado.id == id_informe_catedra)
    )
    
    if not informe_catedra:
        raise ValueError(f"No se encontró un informe terminado con id={id_informe_catedra}")
    
    # Obtener datos del informe
    anio = informe_catedra.anio
    duracion = informe_catedra.duracion
    asignatura_id = informe_catedra.docente_asignatura.asignatura_id
    
    # Obtener asignatura y encuesta
    asignatura: Optional[Asignatura] = db.scalar(
        select(Asignatura).where(Asignatura.id == asignatura_id)
    )
    
    if not asignatura or not asignatura.encuesta:
        return
    
    encuesta: Encuesta = asignatura.encuesta
    
    # Obtener preguntas cerradas directamente
    preguntas: List[pregunta_schemas.PreguntaCerrada] = encuesta_services.listar_encuestas_pregunta_cerrada
    
    if not preguntas:
        return
    
    # Obtener encuestas finalizadas
    encuestas_finalizadas = db.scalars(
        select(EncuestaFinalizada)
        .where(EncuestaFinalizada.asignatura_id == asignatura_id)
        .where(EncuestaFinalizada.anio == anio)
        .where(EncuestaFinalizada.duracion == duracion)
    ).all()
    
    if not encuestas_finalizadas:
        return
    
    # Obtener respuestas
    ids_encuestas = [e.id for e in encuestas_finalizadas]
    respuestas = db.scalars(
        select(Respuesta).where(Respuesta.encuesta_finalizada_id.in_(ids_encuestas))
    ).all()
    
    total_encuestas = len(encuestas_finalizadas)
    
    # Procesar cada pregunta y guardar indicadores
    for pregunta in preguntas:
        # Crear registro de indicadores para el informe
        indicadores_informe = IndicadoresInforme(
            id_informe_catedra_finalizado=informe_catedra.id,
            id_pregunta_encuesta=pregunta.id,
        )
        db.add(indicadores_informe)
        db.flush()
        
        # Obtener opciones para esta pregunta
        opciones = db.scalars(
            select(Opcion).where(Opcion.pregunta_id == pregunta.id)
        ).all()
        
        # Filtrar respuestas para esta pregunta
        respuestas_pregunta = [r for r in respuestas if r.pregunta_id == pregunta.id]
        
        # Calcular porcentajes para cada opción
        for opcion in opciones:
            respuestas_opcion = [r for r in respuestas_pregunta if r.opcion_id == opcion.id]
            cantidad = len(respuestas_opcion)
            porcentaje = (cantidad / total_encuestas * 100) if total_encuestas > 0 else 0
            
            # Crear registro de indicadores por pregunta
            indicadores_pregunta = IndicadoresPregunta(
                id_indicadores_informe=indicadores_informe.id,
                id_opcion=opcion.id,
                porcentaje=round(porcentaje, 2),
            )
            db.add(indicadores_pregunta)
    
    db.commit()

def recuperar_indicadores(
    db: Session,
    id_informe_catedra_finalizado: int
) -> List[schemas.IndicadoresPregunta]:
    informes = db.scalars(
        select(IndicadoresInforme)
        .where(IndicadoresInforme.id_informe_catedra_finalizado == id_informe_catedra_finalizado)
    ).all()
    
    if not informes:
        return []
    
    indicadores: List[schemas.IndicadoresPregunta] = []
    
    for informe in informes:
        pregunta: Optional[Pregunta] = db.scalar(
            select(Pregunta).where(Pregunta.id == informe.id_pregunta_encuesta)
        )
        
        indicadores_pregunta = db.scalars(
            select(IndicadoresPregunta)
            .where(IndicadoresPregunta.id_indicadores_informe == informe.id)
        ).all()
        
        # Procesar opciones y porcentajes
        opciones = []
        for dato in indicadores_pregunta:
            opcion: Optional[Opcion] = db.scalar(
                select(Opcion).where(Opcion.id == dato.id_opcion)
            )
            
            opciones.append(
                schemas.OpcionPorcentaje(
                    opcion_id=str(opcion.contenido) if opcion else f"Opción {dato.id_opcion}",
                    porcentaje=dato.porcentaje
                )
            )
        
        indicadores.append(
            schemas.IndicadoresPregunta(
                id_pregunta=str(pregunta.enunciado) if pregunta else f"Pregunta {informe.id_pregunta_encuesta}",
                indicadores=opciones
            )
        )
    
    return [
    schemas.IndicadoresPregunta(
        id_pregunta=str(pregunta.enunciado) if pregunta else f"Pregunta {informe.id_pregunta_encuesta}",
        indicadores=[
            schemas.OpcionPorcentaje(
                opcion_id=str(opcion.contenido) if opcion else f"Opción {dato.id_opcion}",
                porcentaje=dato.porcentaje
            )
            for dato, opcion in zip(indicadores_pregunta, opciones)
        ]
    )
    for informe in informes
]


def cantidad_encuestas_finalizadas(
    db: Session,
    id_asignatura: int,
    anio: int,
    duracion: str
) -> int:
    stmt = (
        select(func.count())
        .select_from(EncuestaFinalizada)
        .where(EncuestaFinalizada.asignatura_id == id_asignatura)
        .where(EncuestaFinalizada.anio == anio)
        .where(EncuestaFinalizada.duracion == duracion)
    )
    count = db.scalar(stmt)
    return count or 0

