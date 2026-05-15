from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    education_level = Column(String(100), nullable=True)  # bac, licence, master, doctorat, etc.
    domain = Column(String(100), nullable=True)  # informatique, gestion, etc.
    skills = Column(Text, nullable=True)  # JSON ou liste de compétences
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=True)

    user = relationship("User", back_populates="candidate_profile")
