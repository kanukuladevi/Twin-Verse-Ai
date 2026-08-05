from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class TwinProfile(Base):
    __tablename__ = "twin_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Core twin memory & personalization
    primary_domain = Column(String(50), default="education") # education, support, healthcare, business, personal, content
    goals = Column(JSON, default=list) # e.g. ["Become Data Analyst", "Maintain low stress", "Save $500/mo"]
    interests = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    budget = Column(String(100), default="Medium")
    job_preference = Column(String(100), default="Private") # Government or Private
    
    # Domain specific memory snapshots
    education_memory = Column(JSON, default=dict) # Stream (MPC/BiPC/etc), Rank, Target College, Skill level
    health_memory = Column(JSON, default=dict) # Age, Gender, BMI, Conditions, Medications, Allergies
    business_memory = Column(JSON, default=dict) # Business Type, Monthly Revenue, Inventory alerts
    personal_memory = Column(JSON, default=dict) # Sleep average, Daily routine, Active habits, Study streak
    content_memory = Column(JSON, default=dict) # Niche, Main platform, Follower count, Best posting time
    customer_memory = Column(JSON, default=dict) # Preferred language, Recent orders, Satisfaction score

    # Communication style & personality
    communication_style = Column(String(100), default="Encouraging & Direct")
    last_active = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="twin_profile")
