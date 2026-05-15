from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

from .config import settings
from .routes.auth_routes import router as auth_router
from .routes.user_routes import router as user_router
from .routes.job_offer_routes import router as job_offer_router
from .routes.application_routes import router as application_router
from .routes.candidate_profile_routes import router as candidate_profile_router
from .routes.job_offer_review_routes import router as job_offer_review_router
from .routes.admin_routes import router as admin_router
from .services.file_service import FileService

app = FastAPI(title="Gestion Appels d'Offres API - Mairie de Goma")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialiser le répertoire d'upload
FileService.initialize_upload_dir()

# Servir les fichiers uploadés de manière statique
upload_path = Path(settings.UPLOAD_DIR)
if upload_path.exists():
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(user_router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(job_offer_router, prefix=f"{settings.API_PREFIX}/job-offers", tags=["job_offers"])
app.include_router(application_router, prefix=f"{settings.API_PREFIX}/applications", tags=["applications"])
app.include_router(candidate_profile_router, prefix=f"{settings.API_PREFIX}/profiles/candidate", tags=["candidate_profiles"])
app.include_router(job_offer_review_router, prefix=f"{settings.API_PREFIX}/reviews", tags=["reviews"])
app.include_router(admin_router, prefix=f"{settings.API_PREFIX}/admin", tags=["admin"])


@app.get("/")
def root():
    return {
        "message": "Gestion Appels d'Offres API - Mairie de Goma",
        "version": "2.0.0",
        "status": "operational",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
