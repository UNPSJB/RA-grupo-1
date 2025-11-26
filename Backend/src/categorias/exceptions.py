from src.categorias.constants import ErrorCode
from src.exceptions import NotFound

class CategoriaNoEncontrada(NotFound):
    DETAIL = ErrorCode.CATEGORIA_NO_ENCONTRADA