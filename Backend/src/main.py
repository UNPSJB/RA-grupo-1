import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import Base, engine
from src.models import ModeloBase
from src.personas.models import Persona

# importamos los routers desde nuestros modulos
from src.personas.router import router as personas_router
from src.encuestas.router import router as encuestas_router
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


app.include_router(personas_router)
app.include_router(encuestas_router)

@app.get("/")
def read_root():
    return {"message": "Backend de Reporte de encuestas 🚀"}
