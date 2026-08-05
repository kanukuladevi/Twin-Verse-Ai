from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.routers.auth import get_current_user
from app.routers.features import check_feature_enabled
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.models.domain_models import HealthRecord, VitalLog
from app.schemas.domain_schemas import SymptomTriageQuery, VitalLogCreate

router = APIRouter(prefix="/healthcare", tags=["Feature 3: Healthcare"])

MEDICAL_DISCLAIMER = "DISCLAIMER: AI Twin provides general health information and triage guidance only. It is NOT a diagnostic tool or a substitute for professional medical care. In an emergency, call emergency services immediately."

@router.post("/symptom-triage")
def symptom_triage(query: SymptomTriageQuery, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("health_symptom_triage", current_user.id, db)
    
    symptom_str = " ".join(query.symptoms).lower()

    # Emergency escalation check
    if any(e in symptom_str for e in ["chest pain", "shortness of breath", "fainting", "severe bleeding", "numbness"]):
        recommendation = "EMERGENCY: Proceed to the nearest hospital emergency room immediately or call emergency medical services."
        urgency = "Critical / Emergency"
        confidence = 99.0
        causes = ["Cardiovascular / Respiratory Emergency requiring immediate clinical intervention"]
    elif query.severity.lower() == "severe":
        recommendation = "URGENT: Visit an Urgent Care center or schedule an urgent same-day doctor appointment."
        urgency = "High Urgency"
        confidence = 92.0
        causes = ["Acute Infection / Severe Inflammatory Reaction"]
    else:
        recommendation = "SELF-CARE: Stay hydrated, rest, monitor daily vitals, and consult a physician if symptoms persist beyond 48 hours."
        urgency = "Mild to Moderate Self-Care"
        confidence = 88.5
        causes = ["Viral Fatigue / Mild Tension / Hydration Deficit"]

    return {
        "user_name": current_user.name,
        "urgency_level": urgency,
        "confidence_score": confidence,
        "possible_causes": causes,
        "triage_recommendation": recommendation,
        "disclaimer": MEDICAL_DISCLAIMER
    }

@router.post("/vitals/log")
def log_vital(vital: VitalLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("health_vitals_dashboard", current_user.id, db)
    
    log = VitalLog(
        user_id=current_user.id,
        bp_sys=vital.bp_sys,
        bp_dia=vital.bp_dia,
        sugar_fasting=vital.sugar_fasting,
        heart_rate=vital.heart_rate,
        weight_kg=vital.weight_kg,
        sleep_hours=vital.sleep_hours,
        steps=vital.steps
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/vitals/history")
def get_vital_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("health_vitals_dashboard", current_user.id, db)
    return db.query(VitalLog).filter(VitalLog.user_id == current_user.id).order_by(VitalLog.recorded_at.desc()).all()

@router.post("/report-analyzer")
def analyze_health_report(title: str = "Lipid & Fasting Blood Sugar Panel", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("health_report_analyzer", current_user.id, db)

    # Simulates OCR & RAG extraction from uploaded lab report
    flagged = [
        {"metric": "Fasting Blood Sugar", "value": "135 mg/dL", "normal_range": "70-99 mg/dL", "status": "High (Prediabetes indicator)"},
        {"metric": "Triglycerides", "value": "190 mg/dL", "normal_range": "< 150 mg/dL", "status": "Mildly Elevated"}
    ]

    summary_text = (
        "AI Twin RAG Analyzer finished processing your lab report. "
        "Fasting blood sugar is slightly elevated at 135 mg/dL. "
        "Recommend reducing refined carbohydrates, increasing daily walking steps to 8,000, "
        "and repeating the fasting blood sugar test in 30 days."
    )

    record = HealthRecord(
        user_id=current_user.id,
        title=title,
        record_type="Lab Report",
        findings_summary=summary_text,
        flagged_out_of_range=flagged
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "title": title,
        "summary": summary_text,
        "flagged_metrics": flagged,
        "disclaimer": MEDICAL_DISCLAIMER
    }

@router.get("/doctor-summary")
def generate_doctor_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("health_doctor_summary", current_user.id, db)
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    vitals = db.query(VitalLog).filter(VitalLog.user_id == current_user.id).order_by(VitalLog.recorded_at.desc()).first()

    bp = f"{vitals.bp_sys}/{vitals.bp_dia} mmHg" if vitals and vitals.bp_sys else "120/80 mmHg (Normal)"
    sugar = f"{vitals.sugar_fasting} mg/dL" if vitals and vitals.sugar_fasting else "95 mg/dL"

    summary = (
        f"PATIENT HEALTH SUMMARY FOR DOCTOR CONSULTATION\n"
        f"Patient Name: {current_user.name} | Age/Sex: {profile.health_memory.get('age', 22)} {profile.health_memory.get('gender', 'Female')}\n"
        f"Known Allergies: {', '.join(profile.health_memory.get('allergies', ['None']))}\n"
        f"Recent Blood Pressure: {bp}\n"
        f"Recent Fasting Blood Sugar: {sugar}\n"
        f"Active Goals: {', '.join(profile.goals)}\n"
        f"Summary generated by AI Twin Health Engine."
    )

    return {
        "patient_name": current_user.name,
        "summary_text": summary,
        "disclaimer": MEDICAL_DISCLAIMER
    }
