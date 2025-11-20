from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.departamentos.models import Departamento, ModeloBase
from src.carreras.models import Carrera

engine = create_engine("sqlite:///src/desarrollo2025.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


ModeloBase.metadata.create_all(engine)

def cargarDatos():
    with SessionLocal() as db:
        dept_info = [
            ("Informática", ["Analista Programador Universitario", "Licenciatura en Sistemas", "Licenciatura en Informática"]),
            ("Matemáticas", ["Profesorado de Matemática"])
        ]

        for nombre_dept, lista_carreras in dept_info:
            dept = Departamento(nombre=nombre_dept)
            db.add(dept)
            db.flush()  # asigna dept.id automáticamente

            for nombre_carrera in lista_carreras:
                carrera = Carrera(nombre=nombre_carrera, departamento=dept)  # relación ORM
                db.add(carrera)

        db.commit()
        print("Datos insertados correctamente")

if __name__ == "__main__":
    cargarDatos()
