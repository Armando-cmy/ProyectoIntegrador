import base64
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import get_settings

HASH_ALGORITHM = "pbkdf2_sha256"
HASH_ITERATIONS = 600_000
JWT_ALGORITHM = "HS256"
SESSION_COOKIE_NAME = "global_car_session"


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived_key = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, HASH_ITERATIONS
    )
    salt_text = base64.urlsafe_b64encode(salt).decode("ascii")
    key_text = base64.urlsafe_b64encode(derived_key).decode("ascii")
    return f"{HASH_ALGORITHM}${HASH_ITERATIONS}${salt_text}${key_text}"


def verify_password(password: str, stored_password: str) -> tuple[bool, bool]:
    if not stored_password.startswith(f"{HASH_ALGORITHM}$"):
        return hmac.compare_digest(password, stored_password), True

    try:
        algorithm, iterations_text, salt_text, expected_text = stored_password.split("$")
        if algorithm != HASH_ALGORITHM:
            return False, False
        iterations = int(iterations_text)
        if iterations != HASH_ITERATIONS:
            return False, False
        salt = base64.urlsafe_b64decode(salt_text.encode("ascii"))
        expected_key = base64.urlsafe_b64decode(expected_text.encode("ascii"))
    except (ValueError, TypeError):
        return False, False

    actual_key = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, iterations
    )
    return hmac.compare_digest(actual_key, expected_key), False


def create_session_token(user_id: int, remember_me: bool) -> tuple[str, int]:
    lifetime = timedelta(days=7) if remember_me else timedelta(hours=8)
    expires_at = datetime.now(timezone.utc) + lifetime
    secret_key = get_settings().jwt_secret_key
    if len(secret_key) < 32:
        raise RuntimeError("JWT_SECRET_KEY debe tener al menos 32 caracteres.")
    token = jwt.encode(
        {"sub": str(user_id), "exp": expires_at},
        secret_key,
        algorithm=JWT_ALGORITHM,
    )
    return token, int(lifetime.total_seconds())


def decode_session_token(token: str) -> int:
    payload = jwt.decode(
        token,
        get_settings().jwt_secret_key,
        algorithms=[JWT_ALGORITHM],
    )
    subject = payload.get("sub")
    if not isinstance(subject, str) or not subject.isdecimal():
        raise jwt.InvalidTokenError("La sesión no contiene un usuario válido.")
    return int(subject)
