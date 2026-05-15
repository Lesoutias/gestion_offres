from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class JobOfferReview(Base):
    __tablename__ = "job_offer_reviews"

    id = Column(Integer, primary_key=True, index=True)
    job_offer_id = Column(Integer, ForeignKey("job_offers.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=True)  # 1-5
    comment = Column(Text, nullable=True)
    is_report = Column(Boolean, default=False)  # Marquer comme signalement
    created_at = Column(DateTime, default=datetime.utcnow)

    job_offer = relationship("JobOffer", back_populates="reviews")
    candidate = relationship("User")
