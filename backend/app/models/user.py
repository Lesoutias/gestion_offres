from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    full_name = Column(String(150), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    role = relationship("Role", back_populates="users")
    entreprise_profile = relationship("Company", back_populates="owner", uselist=False)
    public_authority_profile = relationship("PublicAuthority", back_populates="user", uselist=False)
    submitted_offers = relationship("Offer", back_populates="submitted_by")
    evaluations = relationship("OfferEvaluation", back_populates="evaluator")
    published_tender_calls = relationship("TenderCall", back_populates="published_by")
    audit_logs = relationship("AuditLog", back_populates="user")
