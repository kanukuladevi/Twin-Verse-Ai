from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from fpdf import FPDF

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.models.decision import Decision
from app.schemas.decision_schema import DecisionRequest, DecisionResponse
from app.agents.supervisor import SupervisorOrchestrator

router = APIRouter(prefix="/decisions", tags=["Multi-Agent Decision Intelligence"])
orchestrator = SupervisorOrchestrator()

def sanitize_pdf_text(text: str) -> str:
    if not text:
        return ""
    # Replace non-latin-1 characters like unicode arrow →
    text = text.replace("→", "->").replace("—", "-").replace("“", '"').replace("”", '"')
    return text.encode("latin-1", errors="replace").decode("latin-1")

@router.post("/evaluate", response_model=DecisionResponse)
def evaluate_decision(req: DecisionRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    profile_dict = {
        "goals": profile.goals if profile else ["Career Growth"],
        "budget": profile.budget if profile else "Medium",
        "job_preference": profile.job_preference if profile else "Private",
        "communication_style": profile.communication_style if profile else "Encouraging & Direct"
    }

    # Execute Multi-Agent Graph Process
    result = orchestrator.process_decision(req.domain, req.user_query, profile_dict, req.user_answers)

    decision = Decision(
        user_id=current_user.id,
        domain=req.domain,
        title=req.title,
        user_query=req.user_query,
        user_answers=req.user_answers or {},
        adaptive_questions=result["adaptive_questions"],
        agent_trace=result["agent_trace"],
        scored_options=result["scored_options"],
        top_recommendation=result["top_recommendation"],
        confidence_score=result["confidence_score"],
        risks_and_tradeoffs=result["risks_and_tradeoffs"],
        why_explanation=result["why_explanation"],
        citations=result["citations"],
        timeline_steps=result["timeline_steps"]
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)

    return decision

@router.get("/list", response_model=List[DecisionResponse])
def list_decisions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Decision).filter(Decision.user_id == current_user.id).order_by(Decision.created_at.desc()).all()

@router.get("/{decision_id}", response_model=DecisionResponse)
def get_decision(decision_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    dec = db.query(Decision).filter(Decision.id == decision_id, Decision.user_id == current_user.id).first()
    if not dec:
        raise HTTPException(status_code=404, detail="Decision report not found")
    return dec

@router.get("/{decision_id}/export-pdf")
def export_decision_pdf(decision_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    dec = db.query(Decision).filter(Decision.id == decision_id, Decision.user_id == current_user.id).first()
    if not dec:
        raise HTTPException(status_code=404, detail="Decision report not found")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 10, sanitize_pdf_text("AI Twin Decision Intelligence Report"), new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, sanitize_pdf_text(f"Title: {dec.title}"), new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, sanitize_pdf_text(f"Domain: {dec.domain.upper()} | Confidence Score: {dec.confidence_score}%"), new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, sanitize_pdf_text(f"Evaluated For: {current_user.name} ({current_user.email})"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 8, "Top Recommendation:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(0, 6, sanitize_pdf_text(dec.top_recommendation), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 8, "Why This Recommendation (Multi-Agent Consensus):", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(0, 6, sanitize_pdf_text(dec.why_explanation), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 8, "Identified Risks & Precautions:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    for risk in dec.risks_and_tradeoffs:
        pdf.multi_cell(0, 5, sanitize_pdf_text(f"- {risk}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 8, "Execution Roadmap Timeline:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    for step in dec.timeline_steps:
        pdf.multi_cell(0, 5, sanitize_pdf_text(f"* [{step.get('phase', 'Step')}]: {step.get('action', '')}"), new_x="LMARGIN", new_y="NEXT")

    pdf_bytes = bytes(pdf.output())
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=AI_Twin_Decision_Report_{dec.id}.pdf"}
    )
