from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    tender_call_id = Column(Integer, ForeignKey("tender_calls.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    submitted_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    montant = Column(Float, nullable=False)
    devise = Column(String(3), nullable=False, default="USD")
    delai_execution = Column(String(100), nullable=True)
    proposition_technique = Column(Text, nullable=True)
    proposition_financiere = Column(Text, nullable=True)
    statut = Column(String(50), nullable=False, default="submitted")
    score_technique = Column(Float, nullable=True)
    score_financier = Column(Float, nullable=True)
    score_total = Column(Float, nullable=True)
    date_soumission = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    tender_call = relationship("TenderCall", back_populates="offres")
    company = relationship("Company", back_populates="offres")
    submitted_by = relationship("User", back_populates="submitted_offers")
    documents = relationship("OfferDocument", back_populates="offer")
    evaluations = relationship("OfferEvaluation", back_populates="offer")
    marche_public = relationship("PublicContract", back_populates="offer", uselist=False)
