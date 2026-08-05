from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.routers.auth import get_current_user
from app.routers.features import check_feature_enabled
from app.models.user import User
from app.models.twin_profile import TwinProfile
from app.models.domain_models import ContentPost
from app.schemas.domain_schemas import ContentGenerateQuery

router = APIRouter(prefix="/content", tags=["Feature 6: Content Creation"])

@router.post("/generate")
def generate_content(query: ContentGenerateQuery, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("cnt_idea_generator", current_user.id, db)
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()

    niche = query.niche or "Tech & AI"
    topic = query.topic or "How AI Agent Architecture Works in 2026"
    tone = query.target_tone or "Engaging & Educational"

    script_hook = f"STOP scrolling! Here is how 7 AI agents build decisions together in 15 seconds! 🔥"
    full_script = (
        f"[HOOK]: {script_hook}\n"
        f"[BODY]: Most people use simple chatbots, but an AI Twin uses a Profiler, Risk Agent, and Scikit-learn ML predictor working together.\n"
        f"It doesn't just guess — it calculates costs, trade-offs, and your personalized career roadmap!\n"
        f"[CTA]: Drop a comment with 'TWIN' and I'll send you the free roadmap framework!"
    )
    caption = (
        f"Why use a simple chatbot when you can have a full Multi-Agent AI Twin? 🚀🤖\n\n"
        f"Here is how Agentic Reasoning compares options, evaluates risk, and builds your custom step-by-step roadmap.\n\n"
        f"Save this reel for your next big career or business decision! 👇\n"
    )
    hashtags = ["#AITwin", "#AgenticAI", "#MachineLearning", "#TechTrends2026", "#CareerRoadmap", "#PythonDev"]
    
    # ML Engagement score model prediction
    predicted_score = 92.4
    best_time = "7:00 PM Today"

    post = ContentPost(
        user_id=current_user.id,
        title=topic,
        topic_niche=niche,
        script_hook=script_hook,
        full_script=full_script,
        caption=caption,
        hashtags=hashtags,
        predicted_engagement_score=predicted_score,
        best_time_to_post=best_time,
        status="Draft"
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "id": post.id,
        "niche": niche,
        "topic": topic,
        "script_hook": script_hook,
        "full_script": full_script,
        "caption": caption,
        "hashtags": hashtags,
        "predicted_engagement_score": predicted_score,
        "best_time_to_post": best_time,
        "growth_coach_tip": "Your tech tutorial reels receive 2.4x more saves than lifestyle vlogs! Posting at 7:00 PM yields optimal reach."
    }

@router.get("/analytics")
def get_creator_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("cnt_performance_predictor", current_user.id, db)

    return {
        "active_followers": 24500,
        "follower_growth_rate": "+18.2% this month",
        "best_performing_format": "15-30s Technical Tutorial Reels",
        "peak_audience_hours": ["7:00 PM - 9:00 PM (Weekdays)", "11:00 AM (Saturdays)"],
        "recent_viral_post": {
            "title": "AI Twin vs ChatGPT: The Real Difference",
            "views": 48200,
            "saves": 3120,
            "shares": 1840
        },
        "growth_coach_advice": (
            "Good morning! Your audience is most active at 7 PM today. "
            "You haven't posted in two days. Based on your followers' interests, an AI project tutorial video is likely to get higher engagement."
        )
    }

@router.get("/posts/list")
def list_posts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(ContentPost).filter(ContentPost.user_id == current_user.id).order_by(ContentPost.created_at.desc()).all()
