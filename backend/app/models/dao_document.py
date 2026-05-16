from sqlalchemy import Column, Integer, Text, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base


class DaoDocument(Base):
    __tablename__ = "dao_documents"

    id = Column(Integer, primary_key=True, index=True)
    tender_call_id = Column(Integer, ForeignKey("tender_calls.id"), nullable=False, unique=True)
    cahier_des_charges = Column(Text, nullable=True)
    criteres_selection = Column(Text, nullable=True)
    conditions_participation = Column(Text, nullable=True)
    pieces_exigees = Column(Text, nullable=True)
    document_url = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    tender_call = relationship("TenderCall", back_populates="dossier_dao")
