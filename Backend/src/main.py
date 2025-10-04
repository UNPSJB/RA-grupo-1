import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase

# Importar tablas base primero (en orden de dependencias)
from src.roles.models import Rol
from src.departamentos.models import Departamento
from src.carreras.models import Carrera
from src.personas.models import Persona
from src.docentes.models import Docente
from src.alumnos.models import Alumno
from src.opciones.models import Opcion
from src.preguntas.models import Pregunta
from src.asignaturas.models import Asignatura
from src.encuestas.models import Encuesta
from src.informes.models import Informe
from src.respuestas.models import Respuesta

# Tablas de vinculación van al final
from src.vinculaciones.models import alumno_asignatura, pregunta_opcion
from src.vinculaciones.asignatura_docente.models import AsignaturaDocente

# Routers
from src.personas.router import router as personas_router
from src.encuestas.router import router as encuestas_router
from src.docentes.router import router as docentes_router
from src.asignaturas.router import router as asignaturas_router
from src.carreras.router import router as carreras_router
from src.departamentos.router import router as departamentos_router
from src.informes.router import router as informes_router
from src.opciones.router import router as opciones_router
from src.respuestas.router import router as respuestas_router
from src.roles.router import router as roles_router
from src.preguntas.router import router as preguntas_router


from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

origins = [
    "http://localhost:5173", 
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
app.include_router(departamentos_router)
app.include_router(docentes_router)
app.include_router(informes_router)
app.include_router(opciones_router)
app.include_router(personas_router)
app.include_router(preguntas_router)
app.include_router(respuestas_router)
app.include_router(roles_router)

@app.get("/")
def read_root():
    return {"message": "Backend de Reporte de encuestas 🚀"}
