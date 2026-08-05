from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class TwinProfileSchema(BaseModel):
    id: int
    user_id: int
    primary_domain: str
    goals: List[str]
    interests: List[str]
    strengths: List[str]
    budget: str
    job_preference: str
    education_memory: Dict[str, Any]
    health_memory: Dict[str, Any]
    business_memory: Dict[str, Any]
    personal_memory: Dict[str, Any]
    content_memory: Dict[str, Any]
    customer_memory: Dict[str, Any]
    communication_style: str

    class Config:
        from_attributes = True

class TwinProfileUpdate(BaseModel):
    primary_domain: Optional[str] = None
    goals: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    strengths: Optional[List[str]] = None
    budget: Optional[str] = None
    job_preference: Optional[str] = None
    education_memory: Optional[Dict[str, Any]] = None
    health_memory: Optional[Dict[str, Any]] = None
    business_memory: Optional[Dict[str, Any]] = None
    personal_memory: Optional[Dict[str, Any]] = None
    content_memory: Optional[Dict[str, Any]] = None
    customer_memory: Optional[Dict[str, Any]] = None
    communication_style: Optional[str] = None
