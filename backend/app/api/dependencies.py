import logging

import httpx
import jwt
from fastapi import Cookie, Depends, HTTPException, status
from postgrest.exceptions import APIError

from app.core.security import SESSION_COOKIE_NAME, decode_session_token
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService, InvalidCredentialsError
from app.core.database import get_supabase_client

logger = logging.getLogger(__name__)


def get_user_repository() -> UserRepository:
    return UserRepository(get_supabase_client())


def get_auth_service(
    users: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(users)


def get_authenticated_user_id(
    session_token: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
) -> int:
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inicia sesión para continuar.",
        )
    try:
        return decode_session_token(session_token)
    except jwt.InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La sesión no es válida o ha expirado.",
        ) from error


def get_admin_user_id(
    user_id: int = Depends(get_authenticated_user_id),
    auth_service: AuthService = Depends(get_auth_service),
) -> int:
    try:
        profile = auth_service.get_profile(user_id)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La cuenta asociada a esta sesión ya no existe.",
        ) from error
    except APIError as error:
        logger.exception("Supabase rejected the administrator authorization request.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo validar el permiso de administración.",
        ) from error
    except httpx.HTTPError as error:
        logger.exception("Could not reach Supabase during administrator authorization.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No se pudo conectar con Supabase.",
        ) from error

    if profile.rol.strip().casefold() != "administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un usuario con rol Administrador puede gestionar usuarios.",
        )
    return user_id
