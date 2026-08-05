from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, JSON, ForeignKey
from datetime import datetime
from app.database import Base

# Education Domain Models
class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    branch = Column(String(100), nullable=False)
    cutoff_rank = Column(Integer, nullable=False)
    exam = Column(String(50), nullable=False) # EAMCET, JEE Main, NEET, CUET, etc.
    fees_per_year = Column(Float, nullable=False)
    avg_placement_lpa = Column(Float, nullable=False)
    rating = Column(Float, default=4.2)
    verified = Column(Boolean, default=True)

class EntranceExam(Base):
    __tablename__ = "entrance_exams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g. EAMCET, JEE, NEET
    eligibility = Column(Text, nullable=False)
    syllabus = Column(Text, nullable=False)
    prep_tips = Column(Text, nullable=False)
    important_dates = Column(String(255), nullable=False)

# Customer Support Domain Models
class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ticket_number = Column(String(50), unique=True, index=True)
    category = Column(String(100), nullable=False) # Payment, Order, Technical, Delivery, General
    department = Column(String(100), nullable=False) # Billing, Operations, IT, Support
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    sentiment = Column(String(50), default="Neutral") # Frustrated, Neutral, Happy, Angry
    priority = Column(String(50), default="Medium") # High, Medium, Low, Urgent
    status = Column(String(50), default="Open") # Open, In Progress, Resolved, Handed to Human
    created_at = Column(DateTime, default=datetime.utcnow)

# Healthcare Domain Models
class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False) # e.g., Blood Report July 2026
    record_type = Column(String(100), nullable=False) # Lab Report, Prescription, Vitals Log
    findings_summary = Column(Text)
    flagged_out_of_range = Column(JSON, default=list) # e.g. [{"metric": "Glucose", "value": "145 mg/dL", "status": "High"}]
    date_recorded = Column(DateTime, default=datetime.utcnow)

class VitalLog(Base):
    __tablename__ = "vital_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bp_sys = Column(Integer, nullable=True) # Blood Pressure Systolic
    bp_dia = Column(Integer, nullable=True) # Blood Pressure Diastolic
    sugar_fasting = Column(Integer, nullable=True) # mg/dL
    heart_rate = Column(Integer, nullable=True) # bpm
    weight_kg = Column(Float, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    steps = Column(Integer, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

# Business Domain Models
class BusinessSale(Base):
    __tablename__ = "business_sales"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    quantity_sold = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    stock_remaining = Column(Integer, nullable=False)
    sale_date = Column(DateTime, default=datetime.utcnow)

# Personal Assistant Domain Models
class TaskItem(Base):
    __tablename__ = "task_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(50), default="Medium") # High, Medium, Low
    category = Column(String(100), default="Personal") # Study, Work, Health, Bills
    due_date = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
    suggested_time_slot = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Content Creation Domain Models
class ContentPost(Base):
    __tablename__ = "content_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    topic_niche = Column(String(100), nullable=False)
    script_hook = Column(Text, nullable=True)
    full_script = Column(Text, nullable=True)
    caption = Column(Text, nullable=True)
    hashtags = Column(JSON, default=list)
    predicted_engagement_score = Column(Float, default=78.5) # 0 to 100
    best_time_to_post = Column(String(100), nullable=True)
    status = Column(String(50), default="Draft") # Draft, Scheduled, Published
    created_at = Column(DateTime, default=datetime.utcnow)
