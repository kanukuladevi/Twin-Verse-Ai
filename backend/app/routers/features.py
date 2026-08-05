from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.feature_toggle import FeatureToggle
from app.schemas.domain_schemas import ToggleRequest

router = APIRouter(prefix="/features", tags=["Feature Toggles"])

# Default list of all feature keys
DEFAULT_FEATURE_KEYS = [
    # Education
    "edu_roadmaps_10th",
    "edu_roadmaps_inter",
    "edu_ai_advisor",
    "edu_career_roadmaps",
    "edu_college_predictor",
    "edu_entrance_guide",
    "edu_skill_roadmaps",
    "edu_timeline_planner",
    "edu_scholarships",
    "edu_document_checklist",
    # Customer Support
    "supp_247_ai",
    "supp_customer_twin",
    "supp_complaints",
    "supp_smart_routing",
    "supp_order_tracking",
    "supp_voice_assistant",
    "supp_sentiment_detection",
    "supp_human_handoff",
    # Healthcare
    "health_profile_twin",
    "health_symptom_triage",
    "health_med_tracker",
    "health_report_analyzer",
    "health_vitals_dashboard",
    "health_diet_planner",
    "health_doctor_summary",
    # Business
    "biz_dashboard",
    "biz_sales_analysis",
    "biz_inventory",
    "biz_customer_insights",
    "biz_expense_tracker",
    "biz_ai_advisor",
    # Personal Assistant
    "ast_daily_schedule",
    "ast_reminders",
    "ast_todo_list",
    "ast_goal_tracker",
    "ast_weather_travel",
    "ast_habit_tracker",
    # Content Creation
    "cnt_idea_generator",
    "cnt_script_writer",
    "cnt_caption_generator",
    "cnt_posting_schedule",
    "cnt_performance_predictor",
    "cnt_growth_coach"
]

@router.get("/toggles", response_model=Dict[str, bool])
def get_toggles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    toggles = db.query(FeatureToggle).filter(FeatureToggle.user_id == current_user.id).all()
    user_toggles = {t.feature_key: t.enabled for t in toggles}
    
    # Fill defaults (True) if not explicitly set
    result = {}
    for key in DEFAULT_FEATURE_KEYS:
        result[key] = user_toggles.get(key, True)
    return result

@router.post("/toggle")
def set_toggle(req: ToggleRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    toggle = db.query(FeatureToggle).filter(
        FeatureToggle.user_id == current_user.id,
        FeatureToggle.feature_key == req.feature_key
    ).first()

    if toggle:
        toggle.enabled = req.enabled
    else:
        toggle = FeatureToggle(user_id=current_user.id, feature_key=req.feature_key, enabled=req.enabled)
        db.add(toggle)

    db.commit()
    return {"feature_key": req.feature_key, "enabled": req.enabled, "status": "updated"}

def check_feature_enabled(feature_key: str, user_id: int, db: Session):
    toggle = db.query(FeatureToggle).filter(
        FeatureToggle.user_id == user_id,
        FeatureToggle.feature_key == feature_key
    ).first()
    if toggle and not toggle.enabled:
        raise HTTPException(
            status_code=403,
            detail=f"The feature '{feature_key}' is currently disabled in your Settings."
        )
