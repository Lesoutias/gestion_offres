from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.public_authority import PublicAuthority
from ..schemas.public_authority_schema import (
    DefineNeedRequest,
    PlanTenderRequest,
    PublicAuthorityCreate,
    PublicAuthorityUpdate,
)
from ..schemas.tender_call_schema import TenderCallCreate
from .tender_call_service import create_tender_call


def list_public_authorities(db: Session) -> list[PublicAuthority]:
    return db.query(PublicAuthority).order_by(PublicAuthority.name.asc()).all()


def get_public_authority(db: Session, authority_id: int) -> PublicAuthority:
    authority = db.query(PublicAuthority).filter(PublicAuthority.id == authority_id).first()
    if not authority:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Autorite publique introuvable")
    return authority


def create_public_authority(db: Session, data: PublicAuthorityCreate) -> PublicAuthority:
    authority = PublicAuthority(**data.model_dump())
    db.add(authority)
    db.commit()
    db.refresh(authority)
    return authority


def update_public_authority(db: Session, authority_id: int, data: PublicAuthorityUpdate) -> PublicAuthority:
    authority = get_public_authority(db, authority_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(authority, field, value)
    db.commit()
    db.refresh(authority)
    return authority


def definir_besoin(db: Session, authority_id: int, data: DefineNeedRequest) -> dict[str, str | int | None]:
    get_public_authority(db, authority_id)
    return {"authority_id": authority_id, "objet": data.objet, "description": data.description}


def planifier_appel_offre(db: Session, authority_id: int, data: PlanTenderRequest, published_by_id: int):
    get_public_authority(db, authority_id)
    tender_data = TenderCallCreate(
        reference=data.reference,
        objet=data.objet,
        description=data.description,
        date_limite=data.date_limite,
        budget_previsionnel=data.budget_previsionnel,
        type_marche=data.type_marche,
        lieu_execution=data.lieu_execution,
        authority_id=authority_id,
        published_by_id=published_by_id,
    )
    return create_tender_call(db, tender_data)
