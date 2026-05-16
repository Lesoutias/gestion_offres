from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models.company import Company
from ..models.contract import Contract
from ..models.execution import Execution
from ..models.offer import Offer
from ..models.public_contract import PublicContract
from ..models.tender_call import TenderCall
from ..models.user import User
from ..schemas.dashboard_schema import AdminDashboardStats, AuthorityDashboardStats, CompanyDashboardStats


def get_admin_stats(db: Session) -> AdminDashboardStats:
    total_awarded_amount = db.query(func.coalesce(func.sum(PublicContract.montant), 0)).scalar() or 0
    return AdminDashboardStats(
        total_users=db.query(User).count(),
        total_companies=db.query(Company).count(),
        verified_companies=db.query(Company).filter(Company.is_verified.is_(True)).count(),
        total_tender_calls=db.query(TenderCall).count(),
        published_tender_calls=db.query(TenderCall).filter(TenderCall.statut == "published").count(),
        closed_tender_calls=db.query(TenderCall).filter(TenderCall.statut == "closed").count(),
        submitted_offers=db.query(Offer).count(),
        awarded_public_contracts=db.query(PublicContract).filter(PublicContract.statut.in_(["awarded", "signed", "in_execution", "completed"])).count(),
        signed_contracts=db.query(Contract).filter(Contract.statut == "signed").count(),
        projects_in_execution=db.query(Execution).filter(Execution.statut.in_(["in_progress", "delayed"])).count(),
        completed_projects=db.query(Execution).filter(Execution.statut == "completed").count(),
        total_awarded_amount=float(total_awarded_amount),
    )


def get_authority_stats(db: Session, authority_id: int) -> AuthorityDashboardStats:
    tender_ids = [row[0] for row in db.query(TenderCall.id).filter(TenderCall.authority_id == authority_id).all()]
    total_awarded_amount = (
        db.query(func.coalesce(func.sum(PublicContract.montant), 0))
        .filter(PublicContract.authority_id == authority_id)
        .scalar()
        or 0
    )
    return AuthorityDashboardStats(
        total_tender_calls=db.query(TenderCall).filter(TenderCall.authority_id == authority_id).count(),
        published_tender_calls=db.query(TenderCall).filter(TenderCall.authority_id == authority_id, TenderCall.statut == "published").count(),
        evaluation_tender_calls=db.query(TenderCall).filter(TenderCall.authority_id == authority_id, TenderCall.statut == "evaluation").count(),
        awarded_tender_calls=db.query(TenderCall).filter(TenderCall.authority_id == authority_id, TenderCall.statut == "awarded").count(),
        submitted_offers=db.query(Offer).filter(Offer.tender_call_id.in_(tender_ids)).count() if tender_ids else 0,
        public_contracts=db.query(PublicContract).filter(PublicContract.authority_id == authority_id).count(),
        signed_contracts=db.query(Contract).join(PublicContract).filter(PublicContract.authority_id == authority_id, Contract.statut == "signed").count(),
        projects_in_execution=db.query(Execution).join(PublicContract).filter(PublicContract.authority_id == authority_id, Execution.statut.in_(["in_progress", "delayed"])).count(),
        completed_projects=db.query(Execution).join(PublicContract).filter(PublicContract.authority_id == authority_id, Execution.statut == "completed").count(),
        total_awarded_amount=float(total_awarded_amount),
    )


def get_company_stats(db: Session, company_id: int) -> CompanyDashboardStats:
    return CompanyDashboardStats(
        submitted_offers=db.query(Offer).filter(Offer.company_id == company_id).count(),
        accepted_offers=db.query(Offer).filter(Offer.company_id == company_id, Offer.statut == "accepted").count(),
        rejected_offers=db.query(Offer).filter(Offer.company_id == company_id, Offer.statut == "rejected").count(),
        won_public_contracts=db.query(PublicContract).filter(PublicContract.company_id == company_id).count(),
        signed_contracts=db.query(Contract).join(PublicContract).filter(PublicContract.company_id == company_id, Contract.statut == "signed").count(),
        projects_in_execution=db.query(Execution).join(PublicContract).filter(PublicContract.company_id == company_id, Execution.statut.in_(["in_progress", "delayed"])).count(),
    )
