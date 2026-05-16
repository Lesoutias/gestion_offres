from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base


class ExecutionReport(Base):
    __tablename__ = "execution_reports"

    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey("executions.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    progress_percentage = Column(Float, nullable=False)
    report_file_url = Column(String(512), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    execution = relationship("Execution", back_populates="progress_reports")
    created_by = relationship("User")
