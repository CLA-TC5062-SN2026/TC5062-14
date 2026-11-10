"""Configuración leída de variables de entorno (.env)."""
import os
import re

from dotenv import load_dotenv

load_dotenv()


def parse_duration(value: str) -> int:
    """Convierte '900', '15m', '1h', '1d' o '30s' a segundos."""
    if value is None or str(value).strip() == "":
        raise ValueError("JWT_EXPIRATION vacío")
    match = re.fullmatch(r"\s*(\d+)\s*([smhd]?)\s*", str(value).lower())
    if not match:
        raise ValueError(f"JWT_EXPIRATION inválido: {value!r} (usa 900, 15m, 1h o 1d)")
    amount, unit = int(match.group(1)), match.group(2) or "s"
    seconds = amount * {"s": 1, "m": 60, "h": 3600, "d": 86400}[unit]
    if seconds <= 0:
        raise ValueError("JWT_EXPIRATION debe ser mayor que cero")
    return seconds


# Vigencia máxima permitida para el token de acceso. El contrato fija 15 min (RNF-11);
# se tolera hasta 24 h para pruebas, pero nunca un token "prácticamente sin expiración".
JWT_EXPIRATION_MAX_SECONDS = 24 * 3600

# Valores de ejemplo publicados (README/.env.example de versiones previas) que no deben usarse como secreto.
SECRETOS_DE_EJEMPLO = {
    "reemplaza_por_un_secreto_aleatorio_de_al_menos_32_caracteres",
    "changeme", "secret", "your-secret-key", "jwt_secret",
}


class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))
    DB_USER = os.getenv("DB_USER", "uncalificado")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "uncalificado")

    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_EXPIRATION = os.getenv("JWT_EXPIRATION", "15m")
    JWT_ALGORITHM = "HS256"

    BCRYPT_ROUNDS = int(os.getenv("BCRYPT_ROUNDS", "12"))

    # Límite del cuerpo de las peticiones (evita agotar memoria con JSON gigantes).
    MAX_CONTENT_LENGTH = 1 * 1024 * 1024

    @classmethod
    def validate(cls, cfg: dict) -> None:
        """Falla al arrancar si la configuración de seguridad no es válida."""
        secret = cfg.get("JWT_SECRET")
        if not secret or len(secret) < 32:
            raise RuntimeError(
                "JWT_SECRET no está definido o tiene menos de 32 caracteres. "
                "Revisa tu archivo .env (ver .env.example)."
            )
        if secret.strip().lower() in SECRETOS_DE_EJEMPLO or len(set(secret)) < 8:
            raise RuntimeError(
                "JWT_SECRET usa un valor de ejemplo o de muy baja variedad. "
                'Genera uno con: python -c "import secrets; print(secrets.token_hex(32))"'
            )
        segundos = parse_duration(cfg.get("JWT_EXPIRATION"))
        if segundos > JWT_EXPIRATION_MAX_SECONDS:
            raise RuntimeError(
                f"JWT_EXPIRATION={cfg.get('JWT_EXPIRATION')} excede el máximo permitido "
                f"({JWT_EXPIRATION_MAX_SECONDS // 3600} h). El contrato fija 15m."
            )
        cfg["JWT_EXPIRATION_SECONDS"] = segundos
