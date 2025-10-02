import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase
from src.alumnos.router import router as alumnos_router
from src.encuestas.router import router as encuestas_router
from src.docentes.router import router as docentes_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="API de encuestas", version="1.0.0")

origins = [
    "http://localhost:5173", 
]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# asociamos los routers a nuestra app
#app.include_router(comerciantes_router)
app.include_router(alumnos_router)
app.include_router(encuestas_router)
app.include_router(docentes_router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido al sistemas de encuetas de la UNPSJB"}