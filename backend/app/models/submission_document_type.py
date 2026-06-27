from sqlalchemy import Boolean, Column, Integer, String

from ..database import Base


class SubmissionDocumentType(Base):
    __tablename__ = "submission_document_types"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), nullable=False, unique=True, index=True)
    label = Column(String(255), nullable=False)
    description = Column(String(512), nullable=True)
    display_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
