from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import relationship

from ..database import Base


class TenderCall(Base):
    __tablename__ = "tender_calls"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(120), unique=True, nullable=False, index=True)
    objet = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    date_publication = Column(DateTime(timezone=True), nullable=True)
    date_limite = Column(DateTime(timezone=True), nullable=False)
    statut = Column(String(50), nullable=False, default="draft")
    budget_previsionnel = Column(Float, nullable=True)
    type_marche = Column(String(100), nullable=True)
    lieu_execution = Column(String(255), nullable=True)
    authority_id = Column(Integer, ForeignKey("public_authorities.id"), nullable=False)
    published_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    authority = relationship("PublicAuthority", back_populates="appels_offres")
    published_by = relationship("User", back_populates="published_tender_calls")
    dossier_dao = relationship("DaoDocument", back_populates="tender_call", uselist=False)
    offres = relationship("Offer", back_populates="tender_call")
    marche_public = relationship("PublicContract", back_populates="tender_call", uselist=False)
