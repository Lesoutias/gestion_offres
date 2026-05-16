from fastapi import HTTPException, status

from ..models.user import User


ADMIN = "admin"
AUTORITE_PUBLIQUE = "autorite_publique"
ENTREPRISE = "entreprise"
COMMISSION_EVALUATION = "commission_evaluation"


def get_user_role(user: User) -> str:
    return user.role.name if user.role else ""


def user_has_role(user: User, roles: list[str]) -> bool:
    return get_user_role(user) in roles


def get_user_permissions(user: User) -> set[str]:
    if not user.role:
        return set()
    return {permission.name for permission in user.role.permissions}


def user_has_permission(user: User, permission: str) -> bool:
    return permission in get_user_permissions(user)


def require_roles(user: User, roles: list[str]) -> None:
    if ADMIN in roles and get_user_role(user) == AUTORITE_PUBLIQUE:
        return
    if not user_has_role(user, roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acces refuse",
        )


def require_permission(user: User, permission: str) -> None:
    if get_user_role(user) == ADMIN:
        return
    if not user_has_permission(user, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission insuffisante",
        )


def require_any_permission(user: User, permissions: list[str]) -> None:
    if get_user_role(user) == ADMIN:
        return
    user_permissions = get_user_permissions(user)
    if not any(permission in user_permissions for permission in permissions):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission insuffisante",
        )
