from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import settings
from .routes.auth_routes import router as auth_router
from .routes.user_routes import router as user_router
from .routes.role_routes import router as role_router
from .routes.permission_routes import router as permission_router
from .routes.public_authority_routes import router as public_authority_router
from .routes.company_routes import router as company_router
from .routes.tender_call_routes import router as tender_call_router
from .routes.dao_document_routes import router as dao_document_router
from .routes.offer_routes import router as offer_router
from .routes.offer_document_routes import router as offer_document_router
from .routes.offer_evaluation_routes import router as offer_evaluation_router
from .routes.public_contract_routes import router as public_contract_router
from .routes.contract_routes import router as contract_router
from .routes.execution_routes import router as execution_router
from .routes.execution_report_routes import router as execution_report_router
from .routes.dashboard_routes import router as dashboard_router
from .routes.audit_log_routes import router as audit_log_router
from .seed_data import seed_database

app = FastAPI(title="Gestion Appels d'Offres API - Mairie de Goma")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
if upload_path.exists():
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(user_router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(role_router, prefix=f"{settings.API_PREFIX}/roles", tags=["roles"])
app.include_router(permission_router, prefix=f"{settings.API_PREFIX}/permissions", tags=["permissions"])
app.include_router(public_authority_router, prefix=f"{settings.API_PREFIX}/public-authorities", tags=["public_authorities"])
app.include_router(company_router, prefix=f"{settings.API_PREFIX}/companies", tags=["companies"])
app.include_router(tender_call_router, prefix=f"{settings.API_PREFIX}/tender-calls", tags=["tender_calls"])
app.include_router(dao_document_router, prefix=f"{settings.API_PREFIX}/dao-documents", tags=["dao_documents"])
app.include_router(offer_router, prefix=f"{settings.API_PREFIX}/offers", tags=["offers"])
app.include_router(offer_document_router, prefix=f"{settings.API_PREFIX}/offer-documents", tags=["offer_documents"])
app.include_router(offer_evaluation_router, prefix=f"{settings.API_PREFIX}/offer-evaluations", tags=["offer_evaluations"])
app.include_router(public_contract_router, prefix=f"{settings.API_PREFIX}/public-contracts", tags=["public_contracts"])
app.include_router(contract_router, prefix=f"{settings.API_PREFIX}/contracts", tags=["contracts"])
app.include_router(execution_router, prefix=f"{settings.API_PREFIX}/executions", tags=["executions"])
app.include_router(execution_report_router, prefix=f"{settings.API_PREFIX}/execution-reports", tags=["execution_reports"])
app.include_router(dashboard_router, prefix=f"{settings.API_PREFIX}/dashboard", tags=["dashboard"])
app.include_router(audit_log_router, prefix=f"{settings.API_PREFIX}/audit-logs", tags=["audit_logs"])


@app.on_event("startup")
def run_seed_on_startup():
    seed_database(verbose=False)


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
