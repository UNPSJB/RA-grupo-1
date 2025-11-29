class ErrorCode:
    ROLE_NOT_FOUND = "Rol no encontrado"
    USER_NOT_FOUND = "Usuario o contraseña incorrectos"
    USERNAME_TAKEN = "Otro usuario ya tiene este username"
    USER_INVALID_PASSWORD = (
        "La contraseña es muy corta, debe contar con al menos 6 caracteres"
    )
    USER_CANNOT_DELETE_ITSELF = "El usuario no puede eliminarse a sí mismo"