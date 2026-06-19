from fastapi import HTTPException, status

from ..models.user import User


ADMIN = "admin"
AUTORITE_PUBLIQUE = "autorite_publique"
ENTREPRISE = "entreprise"
COMMISSION_EVALUATION = "commission_evaluation"
MAIRIE_ROLES = [ADMIN, AUTORITE_PUBLIQUE]


def get_user_role(user: User) -> str:
    return user.role.name if user.role else ""


def is_mairie_role(user: User) -> bool:
    return get_user_role(user) in MAIRIE_ROLES


def user_has_role(user: User, roles: list[str]) -> bool:
    return get_user_role(user) in roles


def get_user_permissions(user: User) -> set[str]:
    if not user.role:
        return set()
    return {permission.name for permission in user.role.permissions}


def user_has_permission(user: User, permission: str) -> bool:
    return permission in get_user_permissions(user)


def require_roles(user: User, roles: list[str]) -> None:
    if not user_has_role(user, roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acces refuse",
        )


def require_permission(user: User, permission: str) -> None:
    if is_mairie_role(user):
        return
    if not user_has_permission(user, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission insuffisante",
        )


def require_any_permission(user: User, permissions: list[str]) -> None:
    if is_mairie_role(user):
        return
    user_permissions = get_user_permissions(user)
    if not any(permission in user_permissions for permission in permissions):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission insuffisante",
        )
