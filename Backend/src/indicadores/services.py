from typing import List, Optional
from sqlalchemy import select, func, delete, update
from sqlalchemy.orm import Session
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.encuesta_finalizada.models import EncuestaFinalizada
from src.asignaturas.models import Asignatura
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta
from src.categorias.models import Categoria
from src.opciones.models import Opcion
from src.encuestas.models import Encuesta
from src.vinculaciones.models import Duracion
from src.indicadores import schemas
from src.indicadores.models import IndicadoresInforme, IndicadoresPregunta
from src.indicadores import schemas
from src.encuestas import services as encuesta_services
from src.preguntas import schemas as pregunta_schemas

def obtener_indicadores(db: Session, id_asignatura: int, anio: int, duracion: Duracion):
    asignatura: Asignatura = db.scalar(select(Asignatura).where(asignatura.id == id_asignatura))     
    encuesta: Encuesta = asignatura.encuesta
    categorias: List[Categoria] = encuesta.categorias

    categorias = [c for c in categorias if c.cod != "A"]

    if not categorias:
        return []
    
    encuestas_finalizadas = db.scalars(
        select(EncuestaFinalizada)  
        .where(EncuestaFinalizada.asignatura_id == id_asignatura)
        .where(EncuestaFinalizada.anio == anio)
        .where(EncuestaFinalizada.duracion == duracion)
    ).all()

    if len(encuestas_finalizadas) == 0:
        return []
    
    ids_encuestas = [e.id for e in encuestas_finalizadas]
    respuestas = db.scalars(
        select(Respuesta).where(Respuesta.encuesta_finalizada_id.in_(ids_encuestas))
    ).all()

    total_encuestas = len(encuestas_finalizadas)
    
    resultado: List[schemas.IndicadoresCategoria] = []

    for categoria in categorias:
        if categoria.codigo == "G":
            preguntas_info = []
        else:
            preguntas_categoria = [p for p in categoria.preguntas if p.tipo == "cerrada"]
            if not preguntas_categoria:
                continue

            preguntas_info = []
            acumulados = {}
            conteo = {}

            for pregunta in preguntas_categoria:
                respuestas_pregunta = [r for r in respuestas if r.pregunta_id == pregunta.id]
                opciones = pregunta.opciones

                datos_opciones = []
                for opcion in opciones:
                    respuestas_opcion = [r for r in respuestas_pregunta if r.opcion_id == opcion.id]
                    cantidad = len(respuestas_opcion)
                    porcentaje = (cantidad / total_encuestas * 100)

                    datos_opciones.append(
                        schemas.OpcionPorcentaje(opcion_id=opcion.contenido, porcentaje=round(porcentaje, 2))
                    )

                    acumulados[opcion.contenido] = acumulados.get(opcion.contenido, 0) + porcentaje
                    conteo[opcion.contenido] = conteo.get(opcion.contenido, 0) + 1

                preguntas_info.append(
                    schemas.DatosEstadisticosPregunta(
                        id_pregunta=pregunta.oracion,
                        datos=datos_opciones
                    )
                )

            promedio_opciones = [
                schemas.OpcionPorcentaje(
                    opcion_id=op,
                    porcentaje=round(acumulados[op] / conteo[op], 2) if conteo[op] > 0 else 0.0
                )
                for op in acumulados.keys()
            ]

        resultado.append(
            schemas.DatosEstadisticosCategoria(
                categoria_codigo=categoria.codigo,
                categoria_texto=categoria.texto,
                promedio_categoria=promedio_opciones,
                preguntas=preguntas_info
            )
        )

    return resultado

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
                id_pregunta=str(pregunta.oracion) if pregunta else f"Pregunta {informe.id_pregunta_encuesta}",
                indicadores=opciones
            )
        )
    
    return [
    schemas.IndicadoresPregunta(
        id_pregunta=str(pregunta.oracion) if pregunta else f"Pregunta {informe.id_pregunta_encuesta}",
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


def obtener_respuestas_abiertas_por_asignatura(
    db: Session,
    id_asignatura: int,
    anio: int,
    duracion: Duracion
) -> List[schemas.IndicadoresAbiertosCategoria]:

    asignatura: Asignatura = db.scalar(select(Asignatura).where(Asignatura.id == id_asignatura))
    encuesta = asignatura.encuesta

    categoria_g: Categoria = next((c for c in encuesta.categorias if c.cod == "G"), None)
    if not categoria_g:
        return []

    encuestas_finalizadas = db.scalars(
        select(EncuestaFinalizada)
        .where(EncuestaFinalizada.asignatura_id == id_asignatura)
        .where(EncuestaFinalizada.anio == anio)
        .where(EncuestaFinalizada.duracion == duracion)
    ).all()

    if len(encuestas_finalizadas) == 0:
        return []

    ids_encuestas = [e.id for e in encuestas_finalizadas]

    respuestas_abiertas = db.scalars(
        select(Respuesta)
        .where(Respuesta.encuesta_completada_id.in_(ids_encuestas))
        .where(Respuesta.texto_respuesta != None)
    ).all()

    # Agrupar respuestas por pregunta
    resultado = []
    for pregunta in categoria_g.preguntas[:3]:
        respuestas_pregunta = [
            r.texto_respuesta for r in respuestas_abiertas if r.pregunta_id == pregunta.id
        ]

        if len(respuestas_pregunta) == 0:
            continue

        resultado.append(
            schemas.DatosAbiertosPregunta(
                id_pregunta=pregunta.id,
                oracion=pregunta.oracion,
                respuestas=respuestas_pregunta
            )
        )

    return [
        schemas.DatosAbiertosCategoria(
            categoria_codigo=categoria_g.codigo,
            categoria_texto=categoria_g.texto,
            preguntas=resultado
        )
    ]
