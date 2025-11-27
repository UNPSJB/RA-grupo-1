import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase
from fastapi.middleware.cors import CORSMiddleware

from src.roles.models import Rol
from src.departamentos.models import Departamento
from src.carreras.models import Carrera
from src.personas.models import Persona
from src.docentes.models import Docente
from src.respuestas.models import Respuesta
from src.alumnos.models import Alumno
from src.opciones.models import Opcion
from src.preguntas.models import Pregunta
from src.asignaturas.models import Asignatura
from src.encuestas.models import Encuesta
from src.sedes.models import Sede
#from src.informes.models import Informe


from src.vinculaciones.models import pregunta_opcion
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente
from src.vinculaciones.models import asignatura_alumno
from src.vinculaciones.asignatura_departamento_sede.models import AsignaturaDepartamentoSede

# Routers
from src.personas.router import router as personas_router
from src.encuestas.router import router as encuestas_router
from src.docentes.router import router as docentes_router
from src.alumnos.router import router as alumnos_router
from src.asignaturas.router import router as asignaturas_router
from src.carreras.router import router as carreras_router
from src.categorias.router import router as categorias_router
from src.indicadores.router import router as indicadores_router
from src.encuesta_finalizada.router import router as encuesta_finalizada_router
from src.departamentos.router import router as departamentos_router
from src.informe_catedra.router import router as informes_router
from src.opciones.router import router as opciones_router
from src.respuestas.router import router as respuestas_router
from src.roles.router import router as roles_router
from src.preguntas.router import router as preguntas_router
from src.ciclos.router import router as ciclos_router
from src.informe_catedra_finalizado.router import router as informe_catedra_finalizado_router
from src.informe_sintetico.router import router as informe_sintetico_router
from src.resultado_informe.router import router as resultado_informe_router
from src.informe_sintetico_finalizado.router import router as informe_sintetico_finalizado_router
from src.pregunta_informe_sintetico.router import router as pregunta_informe_sintetico_router
from src.respuestas_informe.router import router as respuestas_informe_router
from src.auth.router import router as auth_router
from src.personas.router import router as personas_router
from src.sedes.router import router as sedes_router


from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENV = os.getenv("ENV", "development")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}", "")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(asignaturas_router)
app.include_router(encuestas_router)
app.include_router(carreras_router)
app.include_router(categorias_router)
app.include_router(indicadores_router)
app.include_router(encuesta_finalizada_router)
app.include_router(departamentos_router)
app.include_router(docentes_router)
app.include_router(alumnos_router)
app.include_router(informes_router)
app.include_router(opciones_router)
app.include_router(personas_router)
app.include_router(preguntas_router)
app.include_router(respuestas_router)
app.include_router(roles_router)
app.include_router(ciclos_router)
app.include_router(informe_catedra_finalizado_router)
app.include_router(informe_sintetico_router)
app.include_router(resultado_informe_router)
app.include_router(informe_sintetico_finalizado_router)
app.include_router(pregunta_informe_sintetico_router)
app.include_router(respuestas_informe_router)
app.include_router(auth_router)
app.include_router(personas_router)
app.include_router(sedes_router)

@app.get("/")
def read_root():
    return {"message": "Backend de Reporte de encuestas 🚀"}
  