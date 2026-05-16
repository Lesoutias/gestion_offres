from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base


class PublicContract(Base):
    __tablename__ = "public_contracts"

    id = Column(Integer, primary_key=True, index=True)
    tender_call_id = Column(Integer, ForeignKey("tender_calls.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    authority_id = Column(Integer, ForeignKey("public_authorities.id"), nullable=False)
    montant = Column(Float, nullable=False)
    statut = Column(String(50), nullable=False, default="awarded")
    date_attribution = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    tender_call = relationship("TenderCall", back_populates="marche_public")
    company = relationship("Company", back_populates="marches_gagnes")
    offer = relationship("Offer", back_populates="marche_public")
    authority = relationship("PublicAuthority", back_populates="marches_publics")
    contract = relationship("Contract", back_populates="public_contract", uselist=False)
    execution = relationship("Execution", back_populates="public_contract", uselist=False)
