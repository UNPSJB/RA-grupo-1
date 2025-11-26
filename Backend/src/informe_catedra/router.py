from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.informe_catedra import schemas, services, exceptions
from src.categorias import schemas as categoria_schemas
from src.database import get_db
from typing import List

router = APIRouter(prefix="/informes_catedra", tags=["informes_catedra"])


@router.post("/", response_model=schemas.InformeCatedra)
def crear_informe_catedra(
    informe: schemas.InformeCatedraCreate,
    db: Session = Depends(get_db)
):
    return services.crear_informe_catedra(db, informe)


@router.get("/", response_model=List[schemas.InformeCatedra])
def get_informes_catedra(db: Session = Depends(get_db)):
    return services.get_informes_catedra(db)


@router.get("/{informe_id}", response_model=schemas.InformeCatedra)
def get_informe_catedra(informe_id: int, db: Session = Depends(get_db)):
    try:
        return services.get_informe_catedra(db, informe_id)
    except exceptions.InformeNoEncontrado:
        raise HTTPException(404, "Informe no encontrado")


@router.get("/{informe_id}/categorias", response_model=List[categoria_schemas.Categoria])
def get_categorias_informe_catedra(informe_id: int, db: Session = Depends(get_db)):
    informe = services.get_informe_catedra(db, informe_id)
    return informe.categorias


@router.get("/{informe_id}/categorias_con_preguntas",
            response_model=List[schemas.CategoriaConPreguntas])
def read_categorias_con_preguntas(informe_id: int, db: Session = Depends(get_db)):
    return services.get_categorias_con_preguntas_por_informe(db, informe_id)
