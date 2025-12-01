from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from informe_sintetico.models import InformeSintetico
from departamentos.models import ModeloBase

# Configuración de la base de datos
engine = create_engine(
    "sqlite:///src/desarrollo2025.db",
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Crear las tablas si no existen
ModeloBase.metadata.create_all(engine)

def cargar_informes():
    informes = [
        {
            "titulo": "Informe de Evaluación de Ingeniería Informática",
            "contenido": "Contenido 1",
            "fecha": "06/01/2025"
        },
        {
            "titulo": "Informe de Actividades del Departamento de Matemáticas",
            "contenido": "Contenido 2",
            "fecha": "05/02/2025"
        },
        {
            "titulo": "Informe de Proyectos de Graduación",
            "contenido": "Contenido 3",
            "fecha": "19/04/2025"
        },
        {
            "titulo": "Informe de Actividades Extracurriculares",
            "contenido": "Contenido 5",
            "fecha": "23/06/2025"
        },
        {
            "titulo": "Informe de Innovación y Desarrollo",
            "contenido": "Contenido 6",
            "fecha": "30/07/2025"
        }
    ]

    with SessionLocal() as db:
        for info in informes:
            nuevo_informe = InformeSintetico(
                titulo=info["titulo"],
                contenido=info["contenido"],
                fecha=info["fecha"]
            )
            db.add(nuevo_informe)

        db.commit()
        print("Informes cargados correctamente")

if __name__ == "__main__":
    cargar_informes()