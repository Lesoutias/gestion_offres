from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class EmailNotification(Base):
    __tablename__ = "email_notifications"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    recipient_email = Column(String(150), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    sent_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    application = relationship("Application")
    sent_by = relationship("User")
