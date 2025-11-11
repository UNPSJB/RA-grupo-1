from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func, or_
from src.informe_sintetico_finalizado import models, schemas
from src.resultado_informe import services as respuestas_services
from typing import List, Optional
from src.asignaturas.models import Asignatura
from src.asignaturas import schemas as asignatura_schemas
from src.informe_catedra_finalizado.models import InformeCatedraFinalizado
from src.respuestas_informe.models import RespuestaInforme
from src.preguntas.models import Pregunta
from src.vinculaciones.models import asignatura_carrera
from src.vinculaciones.models import Duracion
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.docentes.models import Docente
from src.categorias.models import Categoria

def get_informes_finalizados(db: Session):
    return db.query(models.InformeSinteticoFinalizado).all()

def get_informe_finalizado(db: Session, informe_id: int):
    return db.query(models.InformeSinteticoFinalizado).filter(models.InformeSinteticoFinalizado.id == informe_id).first()

def create_informe_finalizado(db: Session, informe_data: schemas.InformeSinteticoFinalizadoCreate) -> models.InformeSinteticoFinalizado:
    informe_dict = informe_data.model_dump(exclude={"respuestas"})
    respuestas_data = informe_data.respuestas
    db_informe = models.InformeSinteticoFinalizado(**informe_dict)
    db.add(db_informe)
    db.flush() 
    if respuestas_data:
        respuestas_a_guardar = []
        for respuesta in respuestas_data:
            respuesta_create = respuestas_services.schemas.RespuestaInformeSinteticoCreate(
                **respuesta.model_dump(),
                informe_finalizado_id=db_informe.id 
            )
            respuestas_a_guardar.append(respuesta_create)
            
        respuestas_services.guardar_respuestas_lote(db, respuestas_a_guardar)
    
    db.commit()
    db.refresh(db_informe)
    return db_informe

def get_elementos_pregunta2B(db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str)-> List[schemas.TablaPregunta2BItem]:
    asignaturas: list[schemas.Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()
    
    elementos: List[schemas.TablaPregunta2BItem] = []
    for asignatura in asignaturas:
        informe_finalizado:InformeCatedraFinalizado=db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == duracion,
                InformeCatedraFinalizado.asignatura_docente.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                    .selectinload(RespuestaInforme.pregunta)   
        )
        ).first()

        if not informe_finalizado:
            continue

        b: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe 
              if r.pregunta.enunciado == "B: Comunicación y desarrollo de la asignatura"), None)

        c: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado == "C: Metodología"), None)

        d: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado == "D: Evaluación"), None)

        et: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado == "E(TEORIA): Actuación de los miembros de la Cátedra "), None)

        ep: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado == "E(PRACTICA): Actuación de los miembros de la Cátedra "), None)

        elemento = schemas.TablaPregunta2BItem(
            Asignatura = Asignatura,
            encuesta_B = b.texto_respuesta if b else "-",
            encuesta_C = c.texto_respuesta if c else "-",
            encuesta_D = d.texto_respuesta if d else "-",
            encuesta_ET = et.texto_respuesta if et else "-",
            encuesta_EP = ep.texto_respuesta if ep else "-",
            juicio_valor = ""
        )
        elementos.append(elemento)
    return elementos

def get_elementos_pregunta2(db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str) -> List[schemas.TablaPregunta2Item]:
    asignaturas: list[schemas.Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()
    
    elementos: List[schemas.TablaPregunta2Item] = [] 
    
    for asignatura in asignaturas:
        informe_finalizado:InformeCatedraFinalizado=db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == duracion(duracion), 
                InformeCatedraFinalizado.asignatura_docente.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                    .selectinload(RespuestaInforme.pregunta)   
            )
        ).first()

        if not informe_finalizado:
            continue

        r_horas: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Clases teóricas %"), None)
        
        r_practica: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Clases prácticas %"), None)
        
        r_justificacion: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe 
                if r.pregunta.enunciado.strip() == "Justificación"), None)

        elemento = schemas.TablaPregunta2Item(
            Asignatura = Asignatura,
            porcentaje_teoricas = r_horas.texto_respuesta if r_horas and r_horas.texto_respuesta else "-",
            porcentaje_practicas = r_practica.texto_respuesta if r_practica and r_practica.texto_respuesta else "-",
            justificacion = r_justificacion.texto_respuesta if r_justificacion else None
        )
        elementos.append(elemento)
    
    return elementos

def obtener_informacion_general(
    db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str
) -> List[schemas.InformacionGeneral]:

    asignaturas: list[Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()

    elementos: List[schemas.InformacionGeneral] = []


    for asignatura in asignaturas:
        informe_finalizado: InformeCatedraFinalizado = db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == duracion,
                InformeCatedraFinalizado.docente_Asignatura.has(asignatura_id=asignatura.id)
            )
        ).first()
        
        if not informe_finalizado:
            continue

        elemento = schemas.InformacionGeneral(
            asignatura=asignatura,
            codigo=asignatura.matricula,
            nombre=asignatura.nombre,
            cantidad_alumnos=informe_finalizado.cantidadAlumnos or 0,
            cantidad_comisiones_teoricas=informe_finalizado.cantidadComisionesTeoricas or 0,
            cantidad_comisiones_practicas=informe_finalizado.cantidadComisionesPracticas or 0,
        )

        elementos.append(elemento)

    return elementos

def get_elementos_pregunta2C(db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str) -> List[schemas.TablaPregunta2CItem]:
    asignaturas: list[schemas.Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()

    elementos: List[schemas.TablaPregunta2CItem] = []

    for asignatura in asignaturas:
        informe_finalizado: InformeCatedraFinalizado=db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == Duracion(duracion),
                InformeCatedraFinalizado.docente_asignatura.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                .selectinload(RespuestaInforme.pregunta)
            )
        ).first()

        if not informe_finalizado:
            continue

        r_ap_e: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Aspectos positivos: Proceso Enseñanza"), None)
        
        r_ap_a: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Aspectos positivos: Proceso de aprendizaje"), None)
        
        r_o_e: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Obstáculos: Proceso Enseñanza"), None)
        
        r_o_a: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Obstáculos: Proceso de aprendizaje"), None)
        
        r_est: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Estrategias a implementar"), None)
        
        
        respuestas_obj = schemas.RespuestasSeccion2C(
            aspectos_positivos_ensenanza = r_ap_e.texto_respuesta if r_ap_e else None,
            aspectos_positivos_aprendizaje = r_ap_a.texto_respuesta if r_ap_a else None,
            obstaculos_ensenanza = r_o_e.texto_respuesta if r_o_e else None,
            obstaculos_aprendizaje = r_o_a.texto_respuesta if r_o_a else None,
            estrategias = r_est.texto_respuesta if r_est else None,
        )

        elemento = schemas.TablaPregunta2CItem(
            asignatura = asignatura,
            respuestas = respuestas_obj
        )
        elementos.append(elemento)
    
    return elementos

def get_elementos_pregunta2C(db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str) -> List[schemas.TablaPregunta2CItem]:
    asignaturas: list[schemas.Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()

    elementos: List[schemas.TablaPregunta2CItem] = []

    for asignatura in asignaturas:
        informe_finalizado: InformeCatedraFinalizado=db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == Duracion(duracion),
                InformeCatedraFinalizado.asignatura_docente.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                .selectinload(RespuestaInforme.pregunta)
            )
        ).first()

        if not informe_finalizado:
            continue

        r_ap_e: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Aspectos positivos: Proceso Enseñanza"), None)
        
        r_ap_a: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Aspectos positivos: Proceso de aprendizaje"), None)
        
        r_o_e: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Obstáculos: Proceso Enseñanza"), None)
        
        r_o_a: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Obstáculos: Proceso de aprendizaje"), None)
        
        r_est: RespuestaInforme = next((r for r in informe_finalizado.respuestas_informe
                if r.pregunta.enunciado.strip() == "Estrategias a implementar"), None)
        
        
        respuestas_obj = schemas.RespuestasSeccion2C(
            aspectos_positivos_ensenanza = r_ap_e.texto_respuesta if r_ap_e else None,
            aspectos_positivos_aprendizaje = r_ap_a.texto_respuesta if r_ap_a else None,
            obstaculos_ensenanza = r_o_e.texto_respuesta if r_o_e else None,
            obstaculos_aprendizaje = r_o_a.texto_respuesta if r_o_a else None,
            estrategias = r_est.texto_respuesta if r_est else None,
        )

        elemento = schemas.TablaPregunta2CItem(
            asignatura = asignatura,
            respuestas = respuestas_obj
        )
        elementos.append(elemento)
    
    return elementos

def obtener_temas_desarrollados(
    db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str
) -> List[schemas.TemasDesarrolladosItem]:
    
    asignaturas: list[Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()
    
    elementos: List[schemas.TemasDesarrolladosItem] = []
    
    for asignatura in asignaturas:
        informe_finalizado: InformeCatedraFinalizado = db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == duracion,
                InformeCatedraFinalizado.asignatura_docente.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                    .selectinload(RespuestaInforme.pregunta)   
            )
        ).first()

        if not informe_finalizado:
            continue

        respuesta_porcentaje: RespuestaInforme = next(
            (r for r in informe_finalizado.respuestas_informe 
             if r.pregunta.enunciado == "Cantidad de temas desarrollados %"), 
            None
        )
        respuesta_estrategias: RespuestaInforme = next(
            (r for r in informe_finalizado.respuestas_informe 
             if r.pregunta.enunciado == "Estrategias"), 
            None
        )

        elemento = schemas.TemasDesarrolladosItem(
            asignatura = asignatura,
            porcentaje_texto = respuesta_porcentaje.texto_respuesta if respuesta_porcentaje else None,
            estrategias_texto = respuesta_estrategias.texto_respuesta if respuesta_estrategias else None
        )
        
        elementos.append(elemento)
        
    return elementos

def get_actividades_docentes(
    db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str
) -> List[schemas.ActividadesPorAsignaturaItem]:

    asignaturas: list[Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()

    elementos: List[schemas.ActividadesPorAsignaturaItem] = []
    roles_a_buscar = ["Profesor", "JTP", "Auxiliar de Primera", "Auxiliar de Segunda"]

    for asignatura in asignaturas:
        informe_finalizado: InformeCatedraFinalizado = db.scalars(
            select(InformeCatedraFinalizado)
            .join(AsignaturaDocente, InformeCatedraFinalizado.asignatura_docente == AsignaturaDocente.id)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == Duracion(duracion),
                AsignaturaDocente.asignatura_id == asignatura.id
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                    .selectinload(RespuestaInforme.pregunta)
            )
        ).first()

        if not informe_finalizado:
            continue

        lista_docentes_actividades: List[schemas.DocenteConActividades] = []

        def find_response_text(enunciado: str) -> Optional[str]:
            r = next(
                (r for r in informe_finalizado.respuestas_informe
                    if r.pregunta.enunciado.strip() == enunciado.strip()),
                None
            )
            return r.texto_respuesta if r and r.texto_respuesta else None

        for rol in roles_a_buscar:
            nombre_docente = find_response_text(f"Nombre - {rol}")
            if not nombre_docente:
                continue

            actividades_docente = schemas.DocenteActividades(
                capacitacion=find_response_text(f"Capacitación - {rol}"),
                investigacion=find_response_text(f"Investigación - {rol}"),
                extension=find_response_text(f"Extensión - {rol}"),
                gestion=find_response_text(f"Gestión - {rol}"),
                observaciones=find_response_text(f"Observaciones - {rol}")
            )

            lista_docentes_actividades.append(
                schemas.DocenteConActividades(
                    nombre_docente=nombre_docente,
                    rol_docente=rol,
                    actividades=actividades_docente
                )
            )

        if not lista_docentes_actividades:
            docente_relacion = None

            asignatura_docente_rel = db.scalars(
                select(AsignaturaDocente)
                .options(selectinload(AsignaturaDocente.docente))
                .where(AsignaturaDocente.id == informe_finalizado.asignatura_docente_id)
            ).first()
            docente_relacion = asignatura_docente_rel.docente if asignatura_docente_rel else None

            if docente_relacion:
                docente_fallback = schemas.DocenteConActividades(
                    nombre_docente=f"{docente_relacion.apellido}, {docente_relacion.nombre}",
                    rol_docente="Profesor",
                    actividades=schemas.DocenteActividades()
                )
                lista_docentes_actividades.append(docente_fallback)

        elemento = schemas.ActividadesPorAsignaturaItem(
            asignatura=asignatura,
            docentes=lista_docentes_actividades
        )
        elementos.append(elemento)

    return elementos

def get_bibliografia_equipamiento(db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str) -> List[schemas.EquipamientoBibliografia]:

    pregunta_equipamiento = db.scalars(select(Pregunta.id).where(Pregunta.enunciado.ilike("equipamiento"))).first()
    pregunta_bibliografia = db.scalars(select(Pregunta.id).where(Pregunta.enunciado.ilike("bibliografia"))).first()
    
    if not pregunta_equipamiento or not pregunta_bibliografia:
        return []
    
    ID_EQUIPAMIENTO = pregunta_equipamiento
    ID_BIBLIOGRAFIA = pregunta_bibliografia

    asignaturas: list[Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.asignatura_id)
        .where(
            Asignatura.departamento_id == id_dpto,
            asignatura_carrera.c.carrera_id == id_carrera
        )
    ).all()
    
    elementos: List[schemas.EquipamientoBibliografia] = [] 
    
    for asignatura in asignaturas:

        informes_finalizados: List[InformeCatedraFinalizado] = db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == Duracion(duracion), 
                InformeCatedraFinalizado.docente_asignatura.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe)
                    .selectinload(RespuestaInforme.pregunta)   
            )
        ).all() 

        if not informes_finalizados:
            continue

        respuestas_bibliografia = set()
        respuestas_equipamiento = set()
        
        for informe in informes_finalizados:
            
            r_bibliografia: RespuestaInforme = next((r for r in informe.respuestas_informe
                    if r.pregunta_id == ID_BIBLIOGRAFIA and r.texto_respuesta and r.texto_respuesta.strip() != '-'), None) 
            
            r_equipamiento: RespuestaInforme = next((r for r in informe.respuestas_informe
                    if r.pregunta_id == ID_EQUIPAMIENTO and r.texto_respuesta and r.texto_respuesta.strip() != '-'), None) 
            
            if r_bibliografia:
                respuestas_bibliografia.add(r_bibliografia.texto_respuesta.strip())
            
            if r_equipamiento:
                respuestas_equipamiento.add(r_equipamiento.texto_respuesta.strip())
        
        bibliografia_consolidada = "; ".join(respuestas_bibliografia) if respuestas_bibliografia else "-"
        equipamiento_consolidado = "; ".join(respuestas_equipamiento) if respuestas_equipamiento else "-"

        elemento = schemas.EquipamientoBibliografia(
            asignatura = asignatura,
            bibliografia = bibliografia_consolidada,
            equipamiento = equipamiento_consolidado
        )
        elementos.append(elemento)
    
    return elementos

def get_desempeno_auxiliares(db: Session, id_dpto: int, id_carrera: int, anio: int, duracion: str) -> List[schemas.TablaDesempenoAuxiliar]:

    categoria_desempeno = db.scalars(
        select(Categoria.id)
        .where(Categoria.cod == '4')
        .where(func.lower(Categoria.texto).contains('auxiliares'))
        .limit(1)
    ).first()
    
    if not categoria_desempeno:
        categoria_desempeno = db.scalars(
            select(Categoria.id)
            .where(func.lower(Categoria.texto).contains('4.'))
            .where(func.lower(Categoria.texto).contains('auxiliares'))
            .limit(1)
        ).first()
        
    if not categoria_desempeno:
        return []
        
    ID_CATEGORIA_DESEMPENO = categoria_desempeno

    ROLES = ['jtp', 'auxiliar de primera', 'auxiliar de segunda']
    TIPOS_PREGUNTA = ['nombre', 'calificación', 'justificación']

    sub_filtros = [func.lower(Pregunta.enunciado).contains(rol) for rol in ROLES]
    
    preguntas_relevantes = db.execute(
        select(Pregunta.id, Pregunta.enunciado)
        .where(or_(*sub_filtros)) 
        .where(Pregunta.categoria_id == ID_CATEGORIA_DESEMPENO)
    ).all()
    print("Preguntas encontradas:", preguntas_relevantes)
    
    mapa_ids = {}
    
    for id_pregunta, enunciado in preguntas_relevantes: 
        enunciado_lower = enunciado.lower()
        
        rol_key = next((r for r in ROLES if r in enunciado_lower), None)
        tipo_key = next((t for t in TIPOS_PREGUNTA if t in enunciado_lower), None)
        
        if rol_key and tipo_key:
            if rol_key not in mapa_ids:
                mapa_ids[rol_key] = {}
            mapa_ids[rol_key][tipo_key] = id_pregunta

    asignaturas: list[Asignatura] = db.scalars(
        select(Asignatura)
        .join(asignatura_carrera, Asignatura.id == asignatura_carrera.c.msignatura_id)
        .where(Asignatura.departamento_id == id_dpto, asignatura_carrera.c.carrera_id == id_carrera)
    ).all()
    
    elementos: List[schemas.TablaDesempenoAuxiliar] = [] 
    
    for asignatura in asignaturas:
        informes_finalizados = db.scalars(
            select(InformeCatedraFinalizado)
            .where(
                InformeCatedraFinalizado.anio == anio,
                InformeCatedraFinalizado.duracion == Duracion(duracion), 
                InformeCatedraFinalizado.asignatura_docente.has(asignatura_id = asignatura.id)
            )
            .options(
                selectinload(InformeCatedraFinalizado.respuestas_informe).selectinload(RespuestaInforme.pregunta),
                selectinload(InformeCatedraFinalizado.respuestas_informe).selectinload(RespuestaInforme.opcion)
            )
        ).all()

        if not informes_finalizados:
            continue

        auxiliares_consolidados: List[schemas.DesempenoAuxiliarDetalle] = []
        auxiliares_set = set() 
        
        for informe in informes_finalizados:
            
            for rol_key, ids_del_rol in mapa_ids.items(): 
                
                id_nombre = ids_del_rol.get('nombre')
                id_calif = ids_del_rol.get('calificación')
                id_just = ids_del_rol.get('justificación')
                
                if not all([id_nombre, id_calif, id_just]):
                    continue
                
                r_nombre: RespuestaInforme = next((r for r in informe.respuestas_informe
                    if r.pregunta_id == id_nombre and r.texto_respuesta and r.texto_respuesta.strip()), None)
                
                r_calificacion: RespuestaInforme = next((r for r in informe.respuestas_informe
                    if r.pregunta_id == id_calif), None) 
                
                r_justificacion: RespuestaInforme = next((r for r in informe.respuestas_informe
                    if r.pregunta_id == id_just and r.texto_respuesta), None)

                nombre_aux = r_nombre.texto_respuesta.strip() if r_nombre else None
                
                if nombre_aux and nombre_aux not in auxiliares_set:
                    auxiliares_set.add(nombre_aux)
                    
                    calif_codigo = ""
                    if r_calificacion and r_calificacion.opcion and r_calificacion.opcion.contenido:
                        calif_codigo = r_calificacion.opcion.contenido.split(' ')[0].strip().upper() 

                    justificacion_texto = r_justificacion.texto_respuesta.strip() if r_justificacion and r_justificacion.texto_respuesta else ""
                    
                    detalle = schemas.DesempenoAuxiliarDetalle(
                        espacio_curricular=asignatura.nombre,
                        nombre_apellido=nombre_aux,
                        calificacion_E=(calif_codigo == 'E'),
                        calificacion_MB=(calif_codigo == 'MB'),
                        calificacion_B=(calif_codigo == 'B'),
                        calificacion_R=(calif_codigo == 'R'),
                        calificacion_I=(calif_codigo == 'I'),
                        justificacion=justificacion_texto
                    )
                    auxiliares_consolidados.append(detalle)
        
        elemento = schemas.TablaDesempenoAuxiliar(
            asignatura = asignatura,
            auxiliares = auxiliares_consolidados
        )
        elementos.append(elemento)
    
    return elementos