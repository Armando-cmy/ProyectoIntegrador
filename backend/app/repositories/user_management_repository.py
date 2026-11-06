from supabase import Client

from app.models.managed_user import CatalogOption, ManagedUser
from app.repositories.user_repository import UserRelationNotFoundError


class UserManagementRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def list_roles(self) -> list[CatalogOption]:
        result = self.client.table("rol").select("id_rol,nombre").order("nombre").execute()
        return [
            CatalogOption(id=int(row["id_rol"]), nombre=str(row["nombre"]))
            for row in result.data or []
        ]

    def list_branches(self) -> list[CatalogOption]:
        result = (
            self.client.table("sucursal")
            .select("id_sucursal,nombre")
            .order("nombre")
            .execute()
        )
        return [
            CatalogOption(id=int(row["id_sucursal"]), nombre=str(row["nombre"]))
            for row in result.data or []
        ]

    def list_users(self) -> list[ManagedUser]:
        result = (
            self.client.table("usuario")
            .select("id_usuario,nombre,usuario,id_rol,id_sucursal")
            .order("nombre")
            .execute()
        )
        rows = result.data or []
        roles = {option.id: option.nombre for option in self.list_roles()}
        branches = {option.id: option.nombre for option in self.list_branches()}
        users: list[ManagedUser] = []

        for row in rows:
            role_id = int(row["id_rol"])
            branch_id = int(row["id_sucursal"])
            if role_id not in roles:
                raise UserRelationNotFoundError(f"No existe el rol con id_rol={role_id}.")
            if branch_id not in branches:
                raise UserRelationNotFoundError(
                    f"No existe la sucursal con id_sucursal={branch_id}."
                )
            users.append(
                ManagedUser(
                    id_usuario=int(row["id_usuario"]),
                    nombre=str(row["nombre"]),
                    usuario=str(row["usuario"]),
                    rol=roles[role_id],
                    sucursal=branches[branch_id],
                )
            )
        return users

    def username_exists(self, username: str) -> bool:
        result = (
            self.client.table("usuario")
            .select("id_usuario")
            .eq("usuario", username)
            .limit(1)
            .execute()
        )
        return bool(result.data)

    def create_user(
        self,
        nombre: str,
        usuario: str,
        password_hash: str,
        role_id: int,
        branch_id: int,
    ) -> None:
        self.client.table("usuario").insert(
            {
                "nombre": nombre,
                "usuario": usuario,
                "password": password_hash,
                "id_rol": role_id,
                "id_sucursal": branch_id,
            }
        ).execute()
