from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class FeatureToggle(Base):
    __tablename__ = "feature_toggles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    feature_key = Column(String(100), nullable=False) # e.g., "edu_college_predictor", "health_symptom_triage", "biz_sales_analysis"
    enabled = Column(Boolean, default=True)

    __table_args__ = (UniqueConstraint('user_id', 'feature_key', name='_user_feature_uc'),)

    user = relationship("User", back_populates="feature_toggles")
