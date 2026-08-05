from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DecisionRequest(BaseModel):
    domain: str
    title: str
    user_query: str
    user_answers: Optional[Dict[str, Any]] = None

class ScoredOption(BaseModel):
    id: str
    title: str
    description: str
    score: float # 0 to 100
    cost_level: str
    difficulty: str
    benefit: str
    fit_to_goal: float
    risks: List[str]
    pros: List[str]
    cons: List[str]

class DecisionResponse(BaseModel):
    id: int
    user_id: int
    domain: str
    title: str
    user_query: str
    adaptive_questions: List[Dict[str, Any]]
    agent_trace: List[Dict[str, Any]]
    scored_options: List[Dict[str, Any]]
    top_recommendation: str
    confidence_score: float
    risks_and_tradeoffs: List[str]
    why_explanation: str
    citations: List[Dict[str, str]]
    timeline_steps: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True
