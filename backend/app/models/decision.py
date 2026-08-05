from sqlalchemy import Column, Integer, String, Text, JSON, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain = Column(String(50), nullable=False) # education, healthcare, business, etc.
    title = Column(String(255), nullable=False)
    user_query = Column(Text, nullable=False)
    
    # Adaptive Clarifications asked by AI Twin before evaluating
    adaptive_questions = Column(JSON, default=list)
    user_answers = Column(JSON, default=dict)

    # Multi-Agent Trace & Results
    agent_trace = Column(JSON, default=list) # List of agent steps (Profiler, Domain, Analytics, Risk, Finance, Wellbeing, Explainability)
    scored_options = Column(JSON, default=list) # Scored & ranked options
    top_recommendation = Column(Text)
    confidence_score = Column(Float, default=85.0) # 0 to 100
    risks_and_tradeoffs = Column(JSON, default=list)
    why_explanation = Column(Text)
    citations = Column(JSON, default=list)
    timeline_steps = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="decisions")
