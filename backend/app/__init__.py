"""Fábrica de la aplicación Flask de UnCalificado."""
from flask import Flask, jsonify

from . import db
from .config import Config
from .errors import register_error_handlers


def create_app(overrides: dict | None = None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    if overrides:
        app.config.update(overrides)
    Config.validate(app.config)          # sin JWT_SECRET válido la API no arranca
    app.json.sort_keys = False           # respeta el orden de campos del contrato
    app.json.ensure_ascii = False        # acentos legibles en las respuestas

    db.init_app(app)
    register_error_handlers(app)

    from .auth.routes import bp as auth_bp
    from .routes.casos_soporte import bp as casos_bp
    from .routes.solicitudes import bp as solicitudes_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(solicitudes_bp)
    app.register_blueprint(casos_bp)

    @app.get("/api/health")
    def health():                        # pública
        return jsonify({"estado": "ok"})

    return app
