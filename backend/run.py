"""Punto de entrada: python run.py

Por seguridad escucha solo en 127.0.0.1 y con el depurador apagado.
- HOST=0.0.0.0 para exponerlo en la red (p. ej. dentro de un contenedor).
- FLASK_DEBUG=1 activa el depurador de Werkzeug, y solo se permite con HOST de loopback:
  su consola ejecuta código Python en el servidor.
"""
import os
import sys

from app import create_app

app = create_app()

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    debug = os.getenv("FLASK_DEBUG") == "1"
    if debug and host not in ("127.0.0.1", "localhost", "::1"):
        sys.exit("FLASK_DEBUG=1 solo se permite con HOST=127.0.0.1 (el depurador permite ejecutar código).")
    app.run(host=host, port=int(os.getenv("PORT", "5000")), debug=debug)
