import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")


class Settings:
    def __init__(self) -> None:
        self.supabase_url = os.getenv("SUPABASE_URL", "").strip()
        self.supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        self.vehicle_images_bucket = os.getenv(
            "SUPABASE_VEHICLE_IMAGES_BUCKET", "vehiculos"
        ).strip()
        self.jwt_secret_key = os.getenv("JWT_SECRET_KEY", "").strip()
        self.frontend_origins = [
            origin.strip()
            for origin in os.getenv(
                "FRONTEND_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000",
            ).split(",")
            if origin.strip()
        ]
        self.environment = os.getenv("APP_ENV", "development").strip().lower()

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    def validate(self) -> None:
        missing = [
            name
            for name, value in (
                ("SUPABASE_URL", self.supabase_url),
                ("SUPABASE_SERVICE_ROLE_KEY", self.supabase_service_role_key),
                ("JWT_SECRET_KEY", self.jwt_secret_key),
            )
            if not value
        ]
        if missing:
            raise RuntimeError(
                f"Faltan variables requeridas en backend/.env: {', '.join(missing)}."
            )
        if any(
            placeholder in value.lower()
            for value in (
                self.supabase_url,
                self.supabase_service_role_key,
                self.jwt_secret_key,
            )
            for placeholder in ("your-project", "your-server", "replace-with")
        ):
            raise RuntimeError(
                "backend/.env todavía contiene valores de ejemplo; reemplázalos por valores reales."
            )
        if self.supabase_service_role_key.startswith("sb_publishable_"):
            raise RuntimeError(
                "SUPABASE_SERVICE_ROLE_KEY no puede ser una clave publishable; configura una clave secreta de servidor."
            )
        if not self.supabase_url.startswith(("https://", "http://")):
            raise RuntimeError("SUPABASE_URL debe comenzar con https:// o http://.")
        if len(self.jwt_secret_key) < 32:
            raise RuntimeError("JWT_SECRET_KEY debe tener al menos 32 caracteres.")
        if not self.vehicle_images_bucket:
            raise RuntimeError("SUPABASE_VEHICLE_IMAGES_BUCKET no puede estar vacío.")


@lru_cache
def get_settings() -> Settings:
    return Settings()
