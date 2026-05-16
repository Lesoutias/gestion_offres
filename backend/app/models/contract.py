from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship

from ..database import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    public_contract_id = Column(Integer, ForeignKey("public_contracts.id"), nullable=False, unique=True)
    reference = Column(String(120), nullable=False, unique=True)
    date_signature = Column(DateTime(timezone=True), nullable=True)
    garanties = Column(Text, nullable=True)
    obligations = Column(Text, nullable=True)
    contract_file_url = Column(String(512), nullable=True)
    statut = Column(String(50), nullable=False, default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    public_contract = relationship("PublicContract", back_populates="contract")
