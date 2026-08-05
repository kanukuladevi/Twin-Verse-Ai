from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Feature Toggle Schema
class ToggleRequest(BaseModel):
    feature_key: str
    enabled: bool

# Education Schemas
class CareerAdvisorRequest(BaseModel):
    interests: List[str]
    subjects: List[str]
    strengths: List[str]
    budget: str # Low, Medium, High
    job_type: str # Government or Private

class CollegePredictorQuery(BaseModel):
    rank: int
    exam: str # EAMCET, JEE Main, NEET, CUET, etc.
    state: str
    branch: Optional[str] = None
    max_fees: Optional[float] = None

# Customer Support Schemas
class TicketCreate(BaseModel):
    category: str
    subject: str
    description: str

class ChatMessageRequest(BaseModel):
    message: str
    language: Optional[str] = "English"

# Healthcare Schemas
class SymptomTriageQuery(BaseModel):
    symptoms: List[str]
    duration: str
    severity: str # Mild, Moderate, Severe
    additional_notes: Optional[str] = None

class VitalLogCreate(BaseModel):
    bp_sys: Optional[int] = None
    bp_dia: Optional[int] = None
    sugar_fasting: Optional[int] = None
    heart_rate: Optional[int] = None
    weight_kg: Optional[float] = None
    sleep_hours: Optional[float] = None
    steps: Optional[int] = None

# Business Schemas
class BusinessSaleCreate(BaseModel):
    product_name: str
    category: str
    quantity_sold: int
    revenue: float
    stock_remaining: int

# Personal Assistant Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "Medium"
    category: str = "Personal"
    due_date: Optional[str] = None

# Content Creation Schemas
class ContentGenerateQuery(BaseModel):
    niche: str # Tech, Travel, Dance, Food, Education, Fitness
    contentType: str # Reel, YouTube Video, Podcast, Post
    topic: Optional[str] = None
    target_tone: str = "Engaging & Motivational"
