from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.schemas.user_schema import TwinProfileSchema, TwinProfileUpdate

router = APIRouter(prefix="/twin", tags=["Digital Twin Memory"])

@router.get("/profile", response_model=TwinProfileSchema)
def get_twin_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    if not profile:
        profile = TwinProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=TwinProfileSchema)
def update_twin_profile(profile_in: TwinProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Twin profile not found")

    update_data = profile_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)

    profile.last_active = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/greeting")
def get_proactive_greeting(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    user_name = current_user.name
    
    stream = profile.education_memory.get("stream", "MPC") if profile else "MPC"
    goal = profile.goals[0] if profile and profile.goals else "Become a Data Analyst / AI Engineer"
    streak = profile.personal_memory.get("study_streak_days", 5) if profile else 5
    
    hour = datetime.now().hour
    time_greeting = "Good morning" if hour < 12 else ("Good afternoon" if hour < 18 else "Good evening")

    greeting_text = (
        f"{time_greeting}, {user_name}! Your AI Twin is online. "
        f"You chose {stream} and are working towards '{goal}'. "
        f"Your current learning streak is {streak} days! "
        f"Based on your priorities, today is an excellent day to practice Python data manipulation and check entrance exam dates."
    )

    return {
        "user_name": user_name,
        "time_greeting": time_greeting,
        "greeting": greeting_text,
        "primary_domain": profile.primary_domain if profile else "education",
        "goals_summary": profile.goals if profile else [],
        "twin_memory_status": "Active & Synchronized"
    }
