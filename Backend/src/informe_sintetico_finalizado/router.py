from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List
import json

from src.database import get_db
from src.informe_sintetico_finalizado.models import InformeSinteticoFinalizado
from src.informe_sintetico_finalizado import schemas, services
from src.resultado_informe.models import ResultadoInforme

router = APIRouter(
    prefix="/informes_sinteticos_finalizados",
    tags=["informes_sinteticos_finalizados"],
)

# ==========================================================
#   1) CREAR INFORME FINALIZADO
# ==========================================================
@router.post(
    "/finalizados/",
    response_model=schemas.InformeSinteticoFinalizado,
    status_code=status.HTTP_201_CREATED,
)
def create_informe_finalizado(
    informe: schemas.InformeSinteticoFinalizadoCreate,
    db: Session = Depends(get_db),
):
    try:
        return services.create_informe_finalizado(db, informe)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al crear informe finalizado: {str(e)}"
        )

# ==========================================================
#   2) LISTAR TODOS LOS INFORMES FINALIZADOS (RESUMEN)
#   -> usado por:
#      - InformeSinteticoHistoricosPage.tsx
#      - useMetricasDepartamento.ts (informesCompletados)
# ==========================================================
@router.get("/finalizados/")
def listar_informes_finalizados(db: Session = Depends(get_db)):
    """
    Devuelve TODOS los informes sintéticos finalizados
    con datos básicos de carrera, departamento y sede.
    """
    from src.carreras.models import Carrera
    from src.departamentos.models import Departamento
    # si tu modelo de sede está separado y lo necesitás:
    from src.sedes.models import Sede  # ajustá el import si está en otro lado

    informes = db.query(InformeSinteticoFinalizado).all()
    resultados = []

    for inf in informes:
        carrera = db.query(Carrera).filter(Carrera.id == inf.carrera_id).first()
        departamento = None
        sede_nombre = None

        if carrera:
            departamento = (
                db.query(Departamento)
                .filter(Departamento.id == carrera.departamento_id)
                .first()
            )

        # ======================
        # SEDE (como cabecera)
        # ======================
        if departamento:
            # si Departamento tiene relación .sede
            if hasattr(departamento, "sede") and departamento.sede:
                # mismo texto que usás en cabecera: depto.sede.nombre
                sede_nombre = getattr(departamento.sede, "nombre", None)
            # o si Departamento tiene sede_id y hay tabla Sede
            elif hasattr(departamento, "sede_id") and departamento.sede_id:
                sede_obj = db.query(Sede).filter(Sede.id == departamento.sede_id).first()
                if sede_obj:
                    sede_nombre = sede_obj.nombre

        resultados.append(
            {
                "id": inf.id,
                "titulo": inf.titulo,
                "anio": inf.anio,
                "duracion": inf.duracion,
                "informe_base_id": inf.informe_base_id,
                "carrera_id": inf.carrera_id,
                "carrera_nombre": carrera.nombre if carrera else None,
                "departamento_id": departamento.id if departamento else None,
                "departamento_nombre": departamento.nombre if departamento else None,
                "sede": sede_nombre,  #  ahora va el nombre correcto
            }
        )

    return resultados

# ==========================================================
#   3) CHEQUEAR SI UN INFORME ESTÁ COMPLETADO
#   -> usado por useMetricasDepartamento.ts
#      GET /finalizados/completado?carrera_id=X&informe_base_id=Y
# ==========================================================
@router.get("/finalizados/completado")
def informe_completado(
    carrera_id: int = Query(...),
    informe_base_id: int = Query(...),
    db: Session = Depends(get_db),
):
    existe = (
        db.query(InformeSinteticoFinalizado)
        .filter(
            InformeSinteticoFinalizado.carrera_id == carrera_id,
            InformeSinteticoFinalizado.informe_base_id == informe_base_id,
        )
        .first()
    )
    return {"completado": existe is not None}

# ==========================================================
#   4) OBTENER INFORME FINALIZADO DETALLADO POR ID
#      (para PDF, ver preguntas + respuestas)
#      GET /finalizados/{id}
# ==========================================================
@router.get("/finalizados/{id}")
def get_informe_finalizado_detalle(id: int, db: Session = Depends(get_db)):
    # 1) Obtener el informe finalizado
    informe = (
        db.query(InformeSinteticoFinalizado)
        .filter(InformeSinteticoFinalizado.id == id)
        .first()
    )

    if not informe:
        raise HTTPException(status_code=404, detail="Informe finalizado no encontrado")

    # 2) Carrera + departamento + sede
    from src.carreras.models import Carrera
    from src.departamentos.models import Departamento

    carrera = db.query(Carrera).filter(Carrera.id == informe.carrera_id).first()
    if carrera:
        departamento = (
            db.query(Departamento)
            .filter(Departamento.id == carrera.departamento_id)
            .first()
        )
    else:
        departamento = None

    # 3) Preguntas del informe base
    from src.pregunta_informe_sintetico.models import PreguntaInformeSintetico

    preguntas = (
        db.query(PreguntaInformeSintetico)
        .filter(PreguntaInformeSintetico.informe_base_id == informe.informe_base_id)
        .order_by(PreguntaInformeSintetico.orden.asc())
        .all()
    )

    # 4) Respuestas guardadas (ResultadoInforme)
    respuestas_db = (
        db.query(ResultadoInforme)
        .filter(ResultadoInforme.asignatura_id == informe.id)
        .all()
    )

    respuestas_map = {r.pregunta_id: r.texto_respuesta for r in respuestas_db}

    # 5) Unir preguntas + respuestas + estructura
    preguntas_completas = []

    for p in preguntas:
        try:
            estructura = json.loads(p.estructura) if p.estructura else None
        except Exception:
            estructura = None

        raw = respuestas_map.get(p.id)

        if estructura and estructura.get("tipo") == "tabla":
            try:
                respuesta_final = json.loads(raw) if raw else []
            except Exception:
                respuesta_final = []
        else:
            respuesta_final = raw or ""

        preguntas_completas.append(
            {
                "id": p.id,
                "codigo": p.codigo,
                "oracion": p.oracion,
                "orden": p.orden,
                "estructura": estructura,
                "respuesta": respuesta_final,
            }
        )

    # 6) Respuesta final completa
    return {
        "id": informe.id,
        "titulo": informe.titulo,
        "anio": informe.anio,
        "duracion": informe.duracion,
        "informe_base_id": informe.informe_base_id,
        "carrera_id": informe.carrera_id,
        "carrera_nombre": carrera.nombre if carrera else None,
        "departamento_id": departamento.id if departamento else None,
        "departamento_nombre": departamento.nombre if departamento else None,
        "sede": departamento.sede.nombre if departamento and departamento.sede else "-",
        "preguntas": preguntas_completas,
    }

# ==========================================================
#   5) ENDPOINTS AUXILIARES PARA TABLAS Y SECCIONES
# ==========================================================
@router.get("/tabla_pregunta_2B/")
def get_tabla_pregunta_2B(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db),
):
    try:
        return services.get_elementos_pregunta2B(
            db, id_dpto, id_carrera, anio, duracion
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener tabla de pregunta 2B: {str(e)}",
        )


@router.get("/tabla_pregunta_2/", response_model=List[schemas.TablaPregunta2Item])
def get_tabla_porcentaje_horas(
    id_dpto: int = Query(...),
    id_carrera: int = Query(...),
    anio: int = Query(...),
    duracion: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
        return services.get_elementos_pregunta2(
            db, id_dpto, id_carrera, anio, duracion
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener tabla de porcentaje de horas: {str(e)}",
        )


@router.get("/informacion-general/", response_model=List[schemas.InformacionGeneral])
def obtener_informacion_general(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db),
):
    try:
        elementos = services.obtener_informacion_general(
            db, id_dpto, id_carrera, anio, duracion
        )
        if not elementos:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron informes completados para los filtros dados.",
            )
        return elementos
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener información general: {str(e)}",
        )


@router.get("/temas-desarrollados/", response_model=List[schemas.TemasDesarrolladosItem])
def obtener_temas_desarrollados(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db),
):
    try:
        return services.obtener_temas_desarrollados(
            db, id_dpto, id_carrera, anio, duracion
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener temas desarrollados: {str(e)}",
        )


@router.get("/tabla_pregunta_2C/", response_model=List[schemas.TablaPregunta2CItem])
def get_preguntas_2C(
    id_dpto: int = Query(...),
    id_carrera: int = Query(...),
    anio: int = Query(...),
    duracion: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
        elementos = services.get_elementos_pregunta2C(
            db, id_dpto, id_carrera, anio, duracion
        )
        if not elementos:
            raise HTTPException(
                status_code=404,
                detail="No se encontraron respuestas de cátedra para la sección 2.C.",
            )
        return elementos
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener respuestas de sección 2C: {str(e)}",
        )


@router.get("/bibliografia_equipamiento/", response_model=List[schemas.EquipamientoBibliografia])
def get_bibliografia_equipamiento(
    id_dpto: int = Query(...),
    id_carrera: int = Query(...),
    anio: int = Query(...),
    duracion: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
        return services.get_bibliografia_equipamiento(
            db, id_dpto, id_carrera, anio, duracion
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener bibliografía y equipamiento: {str(e)}",
        )


@router.get("/actividades-docentes/", response_model=List[schemas.ActividadesPorAsignaturaItem])
def get_actividades_docentes_por_asignatura(
    id_dpto: int,
    id_carrera: int,
    anio: int,
    duracion: str,
    db: Session = Depends(get_db),
):
    try:
        return services.get_actividades_docentes(
            db, id_dpto, id_carrera, anio, duracion
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener actividades docentes: {str(e)}",
        )


@router.get("/desempeno_auxiliares/", response_model=List[schemas.TablaDesempenoAuxiliar])
def get_desempeno_auxiliares(
    id_dpto: int = Query(...),
    id_carrera: int = Query(...),
    anio: int = Query(...),
    duracion: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
        return services.get_desempeno_auxiliares(
            db, id_dpto, id_carrera, anio, duracion
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener desempeño de auxiliares: {str(e)}",
        )
