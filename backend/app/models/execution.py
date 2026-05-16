from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship

from ..database import Base


class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)
    public_contract_id = Column(Integer, ForeignKey("public_contracts.id"), nullable=False, unique=True)
    avancement = Column(Float, nullable=False, default=0.0)
    date_debut = Column(DateTime(timezone=True), nullable=True)
    date_fin_prevue = Column(DateTime(timezone=True), nullable=True)
    date_fin_reelle = Column(DateTime(timezone=True), nullable=True)
    statut = Column(String(50), nullable=False, default="not_started")
    observations = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    public_contract = relationship("PublicContract", back_populates="execution")
    progress_reports = relationship("ExecutionReport", back_populates="execution")
