from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_offer_id = Column(Integer, ForeignKey("job_offers.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cover_letter = Column(Text, nullable=True)
    status = Column(String(50), default="pending")  # pending, reviewed, shortlisted, rejected, invited, accepted
    created_at = Column(DateTime, default=datetime.utcnow)

    job_offer = relationship("JobOffer", back_populates="applications")
    candidate = relationship("User", back_populates="applications")
    documents = relationship("ApplicationDocument", back_populates="application", cascade="all, delete-orphan")

    @property
    def candidate_full_name(self):
        return self.candidate.full_name if self.candidate else None

    @property
    def candidate_email(self):
        return self.candidate.email if self.candidate else None

    @property
    def job_offer_title(self):
        return self.job_offer.title if self.job_offer else None

    @property
    def job_offer_location(self):
        return self.job_offer.location if self.job_offer else None
