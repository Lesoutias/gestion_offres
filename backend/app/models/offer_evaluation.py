from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base


class OfferEvaluation(Base):
    __tablename__ = "offer_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    evaluator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    technical_score = Column(Float, nullable=False)
    financial_score = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    recommendation = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    offer = relationship("Offer", back_populates="evaluations")
    evaluator = relationship("User", back_populates="evaluations")
