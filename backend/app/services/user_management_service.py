from app.core.security import hash_password
from app.models.managed_user import CatalogOption, ManagedUser
from app.repositories.user_management_repository import UserManagementRepository


class UsernameAlreadyExistsError(Exception):
    pass


class InvalidUserAssignmentError(Exception):
    pass


class UserManagementService:
    def __init__(self, users: UserManagementRepository) -> None:
        self.users = users

    def get_options(self) -> tuple[list[CatalogOption], list[CatalogOption]]:
        return self.users.list_roles(), self.users.list_branches()

    def list_users(self) -> list[ManagedUser]:
        return self.users.list_users()

    def create_user(
        self,
        nombre: str,
        usuario: str,
        password: str,
        role_id: int,
        branch_id: int,
    ) -> None:
        if self.users.username_exists(usuario):
            raise UsernameAlreadyExistsError

        roles, branches = self.get_options()
        if role_id not in {role.id for role in roles}:
            raise InvalidUserAssignmentError("El rol seleccionado ya no existe.")
        if branch_id not in {branch.id for branch in branches}:
            raise InvalidUserAssignmentError("La sucursal seleccionada ya no existe.")

        self.users.create_user(
            nombre=nombre,
            usuario=usuario,
            password_hash=hash_password(password),
            role_id=role_id,
            branch_id=branch_id,
        )
