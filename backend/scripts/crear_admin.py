"""Aprovisiona una cuenta de administrador (RF-01-AC-3: no se crean por el registro público).

Uso:
    python scripts/crear_admin.py "Nombre Admin" admin@uncalificado.mx "ContrasenaSegura123"
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402
from app.services import usuarios_service  # noqa: E402


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    nombre, correo, contrasena = sys.argv[1], sys.argv[2].lower(), sys.argv[3]
    if len(contrasena) < 10:
        sys.exit("La contraseña debe tener al menos 10 caracteres.")
    app = create_app()
    with app.app_context():
        version = usuarios_service.version_aviso_vigente()
        try:
            u = usuarios_service.crear(nombre, correo, contrasena, "administrador", True, version)
        except usuarios_service.CorreoDuplicado:
            sys.exit(f"Ya existe una cuenta con el correo {correo}.")
        print(f"Administrador creado: {u['id']} <{u['correo']}>")


if __name__ == "__main__":
    main()
