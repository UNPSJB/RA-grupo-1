from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
# URL de la base de datos (puede ser SQLite por simplicidad)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# Para PostgreSQL sería algo como:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/midb"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}  # connect_args solo para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()