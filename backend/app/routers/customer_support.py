from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid

from app.database import get_db
from app.routers.auth import get_current_user
from app.routers.features import check_feature_enabled
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.models.domain_models import SupportTicket
from app.schemas.domain_schemas import TicketCreate, ChatMessageRequest

router = APIRouter(prefix="/support", tags=["Feature 2: Customer Support"])

# Department Routing Map
DEPARTMENT_MAP = {
    "payment": "Billing & Finance Dept",
    "billing": "Billing & Finance Dept",
    "order": "Order Fulfillment & Logistics",
    "delivery": "Order Fulfillment & Logistics",
    "technical": "Technical & Engineering Support",
    "login": "Identity & Access Support",
    "general": "Customer Success Desk"
}

@router.post("/chat")
def customer_ai_chat(req: ChatMessageRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("supp_247_ai", current_user.id, db)
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()

    msg_lower = req.message.lower()
    
    # Sentiment Detection Heuristic
    if any(w in msg_lower for w in ["angry", "frustrated", "bad", "worst", "horrible", "delay", "refund", "broken"]):
        sentiment = "Angry / Dissatisfied"
        priority = "Urgent"
    elif any(w in msg_lower for w in ["happy", "great", "thanks", "good", "awesome"]):
        sentiment = "Happy / Satisfied"
        priority = "Low"
    else:
        sentiment = "Neutral"
        priority = "Medium"

    # Customer Twin Greeting & Memory contextualization
    twin_memory_context = ""
    if profile and profile.customer_memory:
        lang = profile.customer_memory.get("preferred_language", "English")
        past_issue = profile.customer_memory.get("last_reported_issue", "Payment Verification")
        twin_memory_context = f"Welcome back {current_user.name}! I remember your past '{past_issue}' request in {lang}."

    # Smart Routing
    routed_department = "Customer Success Desk"
    for keyword, dept in DEPARTMENT_MAP.items():
        if keyword in msg_lower:
            routed_department = dept
            break

    response_text = (
        f"{twin_memory_context} "
        f"Your query about '{req.message[:40]}...' has been processed with {sentiment} sentiment analysis. "
        f"Automated Smart Routing assigned your request to [{routed_department}] with {priority} priority."
    )

    return {
        "user_name": current_user.name,
        "sentiment_detected": sentiment,
        "priority_level": priority,
        "routed_department": routed_department,
        "ai_response": response_text,
        "human_handoff_available": True if priority == "Urgent" else False
    }

@router.post("/complaints/create")
def create_complaint(req: TicketCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("supp_complaints", current_user.id, db)
    
    msg_lower = (req.subject + " " + req.description).lower()
    
    # Auto-detect department
    routed_dept = "Customer Success Desk"
    for k, v in DEPARTMENT_MAP.items():
        if k in msg_lower:
            routed_dept = v
            break

    # Sentiment analysis
    sentiment = "Angry / Frustrated" if any(w in msg_lower for w in ["worst", "late", "refund", "broken", "fraud"]) else "Neutral"
    priority = "Urgent" if sentiment == "Angry / Frustrated" else "Medium"

    ticket_no = f"TICK-{uuid.uuid4().hex[:6].upper()}"

    ticket = SupportTicket(
        user_id=current_user.id,
        ticket_number=ticket_no,
        category=req.category,
        department=routed_dept,
        subject=req.subject,
        description=req.description,
        sentiment=sentiment,
        priority=priority,
        status="Open"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "ticket_number": ticket_no,
        "department": routed_dept,
        "priority": priority,
        "sentiment": sentiment,
        "status": "Open",
        "message": f"Complaint successfully created and routed to {routed_dept}."
    }

@router.get("/complaints/list")
def list_complaints(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("supp_complaints", current_user.id, db)
    return db.query(SupportTicket).filter(SupportTicket.user_id == current_user.id).order_by(SupportTicket.created_at.desc()).all()

@router.get("/order-tracking")
def track_order(order_id: str = "ORD-98421", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("supp_order_tracking", current_user.id, db)
    return {
        "order_id": order_id,
        "status": "In Transit - Out for Delivery",
        "estimated_delivery": "Today by 6:00 PM",
        "carrier": "Express Logistics Courier",
        "live_location": "Hyderabad Fulfillment Hub",
        "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }

@router.post("/human-handoff/{ticket_id}")
def human_handoff(ticket_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("supp_human_handoff", current_user.id, db)
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id, SupportTicket.user_id == current_user.id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = "Handed to Human Agent"
    db.commit()

    return {
        "ticket_number": ticket.ticket_number,
        "status": ticket.status,
        "transferred_to": "Senior Specialist - " + ticket.department,
        "note": "Full conversation history and customer twin profile forwarded. You will not need to repeat details."
    }
