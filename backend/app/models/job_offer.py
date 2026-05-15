from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class JobOffer(Base):
    __tablename__ = "job_offers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(150), nullable=True)
    status = Column(String(50), default="pending")  # pending, published, rejected, closed, expired
    created_at = Column(DateTime, default=datetime.utcnow)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    company = relationship("Company", back_populates="job_offers")
    recruiter = relationship("User")
    applications = relationship("Application", back_populates="job_offer")
    reviews = relationship("JobOfferReview", back_populates="job_offer", cascade="all, delete-orphan")

    @property
    def recruiter_full_name(self):
        return self.recruiter.full_name if self.recruiter else None

    @property
    def recruiter_email(self):
        return self.recruiter.email if self.recruiter else None
