from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from ..schemas.auth_schema import AdminUserCreateRequest, CompanyRegisterRequest, LoginRequest, Token
from ..schemas.user_schema import UserRead
from ..security.jwt import verify_token
from ..security.permissions import ADMIN, require_roles
from ..services.auth_service import authenticate_user, create_admin_managed_user, create_tokens, register_company
from ..services.audit_log_service import log_action

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = verify_token(token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur non autorise")
    return user


@router.post("/register", response_model=UserRead)
def register(data: CompanyRegisterRequest, db: Session = Depends(get_db)):
    user = register_company(db, data)
    log_action(db, user.id, "auth.register_company", "User", user.id, "Inscription publique entreprise")
    return user


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")
    log_action(db, user.id, "auth.login", "User", user.id, "Connexion utilisateur")
    return create_tokens(user)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/admin-users", response_model=UserRead)
def create_backoffice_user(
    data: AdminUserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_roles(current_user, [ADMIN])
    user = create_admin_managed_user(db, data)
    log_action(db, current_user.id, "user.create", "User", user.id, "Creation utilisateur back-office")
    return user
