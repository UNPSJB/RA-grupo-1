from pydantic import BaseModel

class LoginRequest(BaseModel):
    usuario: str
    clave: str


class LoginResponse(BaseModel):
    token: str
    alumno_id: int
    docente_id:int
    nombre: str
    apellido: str
    email: str
    mensaje: str
    