from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base


class OfferDocument(Base):
    __tablename__ = "offer_documents"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    document_type = Column(String(100), nullable=False)
    file_url = Column(String(512), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_mime_type = Column(String(100), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    offer = relationship("Offer", back_populates="documents")
