from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.routers.auth import get_current_user
from app.routers.features import check_feature_enabled
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.models.domain_models import TaskItem
from app.schemas.domain_schemas import TaskCreate

router = APIRouter(prefix="/assistant", tags=["Feature 5: Personal Assistant"])

@router.get("/daily-schedule")
def get_daily_schedule(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("ast_daily_schedule", current_user.id, db)
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()

    tasks = db.query(TaskItem).filter(TaskItem.user_id == current_user.id).all()
    
    if not tasks:
        # Default seed schedule for initial demo view
        tasks_list = [
            {"id": 1, "title": "Data Science & Python Practice", "time_slot": "9:00 AM - 10:30 AM", "priority": "High", "completed": False},
            {"id": 2, "title": "Submit Assignment on EAMCET Math", "time_slot": "2:00 PM - 3:00 PM", "priority": "High", "completed": False},
            {"id": 3, "title": "AI Twin Project Team Call", "time_slot": "6:00 PM - 7:00 PM", "priority": "Medium", "completed": True}
        ]
    else:
        tasks_list = [{"id": t.id, "title": t.title, "time_slot": t.suggested_time_slot or "Flexible", "priority": t.priority, "completed": t.completed} for t in tasks]

    return {
        "morning_brief": (
            f"Good morning, {current_user.name}! You have {len(tasks_list)} primary tasks scheduled for today. "
            f"You slept 7.5 hours last night, and your study streak is at 5 days! "
            f"Suggested optimal focus window: 7:00 PM to 9:00 PM."
        ),
        "schedule": tasks_list,
        "habits_summary": {"water_glasses": 6, "target_water": 8, "exercise_mins": 30, "study_streak": 5}
    }

@router.post("/tasks/create")
def create_task(task_in: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("ast_todo_list", current_user.id, db)

    task = TaskItem(
        user_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        category=task_in.category,
        suggested_time_slot="7:00 PM - 8:00 PM"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}/toggle")
def toggle_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("ast_todo_list", current_user.id, db)
    task = db.query(TaskItem).filter(TaskItem.id == task_id, TaskItem.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed
    db.commit()
    return {"id": task.id, "completed": task.completed}

@router.get("/weather-travel")
def get_weather_travel(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("ast_weather_travel", current_user.id, db)

    return {
        "location": "Hyderabad",
        "temperature": "28°C",
        "condition": "Light Rain expected at 4 PM",
        "weather_tip": "Remember to carry an umbrella when leaving for college/office at 3 PM.",
        "traffic_alert": "Heavy traffic reported near Hitec City main junction — leave 15 minutes early."
    }
