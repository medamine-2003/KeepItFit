# backend/app/routes/activity.py
# File path: backend/app/routes/activity.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import User, Activity, MealAnalysis
from app.schemas.activity import ActivityResponse as ActivitySchema, ActivityCreate
from app.schemas.meal_analysis import MealAnalysisCreate, MealAnalysisResponse
from app.database import get_db
from app.auth_utils import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/track-activity", response_model=ActivitySchema)
async def track_activity(
    activity: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_activity = Activity(
        activity=activity.activity,
        duration=activity.duration,
        owner_id=current_user.id
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/recent", response_model=list[ActivitySchema])
async def recent_activities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Activity).filter(Activity.owner_id == current_user.id).order_by(Activity.date.desc()).limit(10).all()
    return items

@router.post("/meal-analysis", response_model=MealAnalysisResponse)
async def save_meal_analysis(
    meal: MealAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_analysis = MealAnalysis(
        image_uri=meal.image_uri,
        analysis_data=meal.analysis,
        owner_id=current_user.id
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

@router.get("/meal-insights", response_model=list[MealAnalysisResponse])
async def meal_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(MealAnalysis).filter(MealAnalysis.owner_id == current_user.id).order_by(MealAnalysis.date.desc()).limit(20).all()
    return items

@router.get("/stats")
async def activity_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    activities = db.query(Activity).filter(
        Activity.owner_id == current_user.id,
        Activity.date >= week_ago
    ).all()
    
    total_minutes = sum(a.duration for a in activities)
    total_activities = len(activities)
    # Rough estimate: ~5-7 cal/min for moderate activity
    calories_burned = total_minutes * 6
    
    # Calculate streak
    all_activities = db.query(Activity).filter(
        Activity.owner_id == current_user.id
    ).order_by(Activity.date.desc()).all()
    
    streak = 0
    if all_activities:
        current_date = datetime.utcnow().date()
        for activity in all_activities:
            activity_date = activity.date.date()
            days_diff = (current_date - activity_date).days
            if days_diff == 0 or days_diff == 1:
                if activity_date < current_date:
                    current_date = activity_date
                streak += 1
            else:
                break
    
    return {
        "totalMinutes": total_minutes,
        "totalActivities": total_activities,
        "caloriesBurned": calories_burned,
        "streak": streak
    }
