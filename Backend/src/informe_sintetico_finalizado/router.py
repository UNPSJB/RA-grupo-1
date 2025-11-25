from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session, selectinload
from typing import List
import json

from src.database import get_db
from src.informe_sintetico_finalizado.models import InformeSinteticoFinalizado
from src.informe_sintetico_finalizado import schemas, services
from src.resultado_informe.models import ResultadoInforme   
#from weasyprint import HTML

router = APIRouter(
    prefix="/informes_sinteticos_finalizados",
    tags=["informes_sinteticos_finalizados"],
)

# ==========================================================
#   CREAR INFORME FINALIZADO
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
#   LISTAR INFORMES FINALIZADOS
# ==========================================================
@router.get("/finalizados/", response_model=List[schemas.InformeSinteticoFinalizado])
def get_informes_finalizados(db: Session = Depends(get_db)):
    try:
        informes = (
            db.query(InformeSinteticoFinalizado)
            .options(selectinload(InformeSinteticoFinalizado.respuestas))
            .all()
        )
        return informes
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener informes finalizados: {str(e)}",
        )


# ==========================================================
#   INFORME COMPLETADO
# ==========================================================
@router.get("/finalizados/completado")
def informe_completado(
    carrera_id: int,
    informe_base_id: int,
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
#   OBTENER INFORME FINALIZADO POR ID
# ==========================================================
@router.get("/finalizados/{id}")
def get_informe_finalizado(id: int, db: Session = Depends(get_db)):
    try:
        informe = (
            db.query(InformeSinteticoFinalizado)
            .filter(InformeSinteticoFinalizado.id == id)
            .first()
        )
        if not informe:
            raise HTTPException(
                status_code=404, detail="Informe finalizado no encontrado"
            )
        return informe
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al obtener informe finalizado: {str(e)}"
        )


# ==========================================================
#   OTROS ENDPOINTS (TABLAS, INFO, ETC)
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

# ==========================================================
#   PDF DEL INFORME SINTÉTICO (DESACTIVADO TEMPORALMENTE)
# ==========================================================

# @router.get("/{informe_id}/pdf")
# def generar_pdf_informe(informe_id: int, db: Session = Depends(get_db)):
#
#     informe = (
#         db.query(InformeSinteticoFinalizado)
#         .options(
#             selectinload(InformeSinteticoFinalizado.respuestas)
#             .selectinload(ResultadoInforme.pregunta),
#             selectinload(InformeSinteticoFinalizado.carrera),
#         )
#         .filter(InformeSinteticoFinalizado.id == informe_id)
#         .first()
#     )
#
#     if not informe:
#         raise HTTPException(status_code=404, detail="Informe no encontrado")
#
#     # Duración: Enum o string
#     try:
#         duracion_str = informe.duracion.value
#     except AttributeError:
#         duracion_str = str(informe.duracion)
#
#     carrera_nombre = (
#         informe.carrera.nombre if getattr(informe, "carrera", None) else informe.carrera_id
#     )
#
#     sede = getattr(informe, "sede", "")
#
#     html = f"""
#     <html>
#       <head>
#         <meta charset="utf-8" />
#         <title>Informe Sintético – {informe.anio}</title>
#         <style>
#           body {{
#             font-family: sans-serif;
#             font-size: 12px;
#           }}
#           h1 {{
#             text-align: center;
#             margin-bottom: 10px;
#           }}
#           table {{
#             border-collapse: collapse;
#             width: 100%;
#             margin-bottom: 10px;
#           }}
#           th, td {{
#             border: 1px solid #000;
#             padding: 4px;
#           }}
#         </style>
#       </head>
#       <body>
#         <h1>Informe Sintético – {informe.anio}</h1>
#
#         <h3>Datos de la cabecera</h3>
#         <p><strong>Sede:</strong> {sede}</p>
#         <p><strong>Carrera:</strong> {carrera_nombre}</p>
#         <p><strong>Duración:</strong> {duracion_str}</p>
#         <hr/>
#     """
#
#     for r in informe.respuestas:
#         if not getattr(r, "pregunta", None):
#             continue
#
#         html += f"<h3>{r.pregunta.codigo}) {r.pregunta.oracion}</h3>"
#
#         try:
#             data = json.loads(r.texto_respuesta)
#             if isinstance(data, list):
#                 if len(data) > 0:
#                     columnas = data[0].keys()
#                     html += "<table><tr>"
#                     html += "".join(f"<th>{c}</th>" for c in columnas)
#                     html += "</tr>"
#                     for fila in data:
#                         html += "<tr>"
#                         html += "".join(f"<td>{fila.get(c,'')}</td>" for c in columnas)
#                         html += "</tr>"
#                     html += "</table>"
#                     continue
#         except Exception:
#             pass
#
#         html += f"<p>{(r.texto_respuesta or '').replace(chr(10), '<br/>')}</p>"
#
#     html += "</body></html>"
#
#     # pdf = HTML(string=html).write_pdf()
#     # return Response(content=pdf, media_type="application/pdf")
