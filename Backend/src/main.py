from src.database import Base, engine
from src import models
from src.encuestas.router import router as encuestas_router
from fastapi import FastAPI

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Encuestas API")

# Incluir routers
app.include_router(encuestas_router)
