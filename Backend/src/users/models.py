from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import relationship, mapped_column, Mapped
from pydantic import EmailStr
from typing import Optional
from src.database import Base
from src.alumnos.models import Alumno
from src.docentes.models import Docente
from src.departamentos.models import Departamento
from src.models import ModeloBase

class User(ModeloBase):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    email: Mapped[EmailStr] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(255))

    role_id: Mapped[Optional[int]] = mapped_column(ForeignKey("role.id"))
    role: Mapped[Optional["Role"]] = relationship("Role")

    alumno_id: Mapped[Optional[int]] = mapped_column(ForeignKey("alumnos.id"))
    alumno: Mapped[Optional["Alumno"]] = relationship("Alumno", back_populates="user")

    docente_id: Mapped[Optional[int]] = mapped_column(ForeignKey("docentes.id"))
    docente: Mapped[Optional["Docente"]] = relationship("Docente", back_populates="user")

    departamento_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departamentos.id"))
    departamento: Mapped[Optional["Departamento"]] = relationship("Departamento", back_populates="user")

    @property
    def is_admin(self):
        return self.role_id == 1

    @property
    def role_name(self):
        return self.role.name


class Role(ModeloBase):
    __tablename__ = "role"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)