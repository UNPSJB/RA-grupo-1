from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from informe.models import Informe
from departamentos.models import ModeloBase

engine = create_engine(
    "sqlite:///./test.db",
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


ModeloBase.metadata.create_all(engine)

def cargar_informes():
    informes = [
        {
            "titulo": "Informe de Evaluación de Ingeniería Informática",
            "contenido": "Contenido 1",
            "fecha": "18/01/2025"
        },
        {
            "titulo": "Informe de Actividades del Departamento de Matemáticas",
            "contenido": "Contenido 2",
            "fecha": "19/02/2025"
        },
        {
            "titulo": "Informe de Proyectos de Graduación",
            "contenido": "Contenido 3",
            "fecha": "20/03/2025"
        },
        {
            "titulo": "Informe de Actividades Extracurriculares",
            "contenido": "Contenido 4",
            "fecha": "22/05/2025"
        },
        {
            "titulo": "Informe de Innovación y Desarrollo",
            "contenido": "Contenido 5",
            "fecha": "23/06/2025"
        }
    ]

    with SessionLocal() as db:
        for info in informes:
            nuevo_informe = Informe(
                titulo=info["titulo"],
                contenido=info["contenido"],
                fecha=info["fecha"]
            )
            db.add(nuevo_informe)

        db.commit()
        print("Los informes se cargaron con exito")

if __name__ == "__main__":
    cargar_informes()