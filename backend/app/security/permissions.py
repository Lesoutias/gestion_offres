"""
Gestion des permissions et contrôle d'accès basé sur les rôles (RBAC)
"""

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..routes.auth_routes import get_current_user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est un administrateur"""
    if current_user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Vous devez être administrateur.",
        )
    return current_user


async def get_current_recruiter(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est un recruteur"""
    if current_user.role.name not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Vous devez être recruteur ou administrateur.",
        )
    return current_user


async def get_current_candidate(
    current_user: User = Depends(get_current_user),
) -> User:
    """Vérifie que l'utilisateur actuel est un candidat"""
    if current_user.role.name != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Vous devez être candidat.",
        )
    return current_user


def require_role(*allowed_roles: str):
    """
    Décorateur pour vérifier que l'utilisateur a l'un des rôles spécifiés.
    
    Usage:
        @router.get("/admin-only", dependencies=[Depends(require_role("admin"))])
        async def admin_endpoint():
            ...
    """
    async def check_role(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.name not in allowed_roles:
            allowed_roles_str = ", ".join(allowed_roles)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Accès refusé. Rôles autorisés: {allowed_roles_str}",
            )
        return current_user
    
    return check_role
