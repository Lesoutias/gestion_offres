from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from ..database import get_db
from ..schemas.auth_schema import LoginRequest, RegisterRequest, Token
from ..schemas.user_schema import UserRead, UserCreate
from ..services.auth_service import authenticate_user, create_user, create_tokens
from ..models.user import User
from ..models.candidate_profile import CandidateProfile
from ..security.jwt import verify_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = verify_token(token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user


@router.post("/register", response_model=UserRead)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email déjà utilisé")
    user = create_user(db, UserCreate(**user_data.dict()))
    
    # Créer un profil candidat si c'est un candidat
    if user.role.name == "candidate":
        candidate_profile = CandidateProfile(user_id=user.id)
        db.add(candidate_profile)
        db.commit()
    
    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        role_name=user.role.name,
    )


@router.post("/login", response_model=Token)
def login(form_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants invalides")
    return create_tokens(user)


@router.get("/me", response_model=UserRead)
def profile(current_user: User = Depends(get_current_user)):
    return UserRead(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        role_name=current_user.role.name,
    )
