from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import models, schemas
from database import get_db
import random
import string

router = APIRouter(prefix="/gamification", tags=["Gamification"])

def generate_referral_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@router.get("/summary/{user_id}", response_model=schemas.UserRewardSummary)
def get_user_rewards(user_id: int, db: Session = Depends(get_db)):
    # Calculate points
    total_points = db.query(func.sum(models.GadiPoint.points)).filter(models.GadiPoint.user_id == user_id).scalar() or 0
    
    # Determine Level
    level = "Bronze"
    if total_points >= 10000: level = "Platinum"
    elif total_points >= 5000: level = "Gold"
    elif total_points >= 2000: level = "Silver"
    
    # Referral Count
    ref_count = db.query(models.Referral).filter(models.Referral.referrer_id == user_id, models.Referral.status == "Completed").count()
    
    # Achievements
    user_achievement_ids = db.query(models.UserAchievement.achievement_id).filter(models.UserAchievement.user_id == user_id).all()
    achievement_ids = [r[0] for r in user_achievement_ids]
    achievements = db.query(models.Achievement).filter(models.Achievement.id.in_(achievement_ids)).all() if achievement_ids else []
    
    return {
        "total_points": total_points,
        "level": level,
        "referral_count": ref_count,
        "achievements": achievements
    }

@router.post("/referral/generate/{user_id}")
def create_referral(user_id: int, db: Session = Depends(get_db)):
    # Check if user already has an active referral code
    existing = db.query(models.Referral).filter(models.Referral.referrer_id == user_id, models.Referral.status == "Pending").first()
    if existing:
        return {"referral_code": existing.referral_code}
    
    code = generate_referral_code()
    new_ref = models.Referral(referrer_id=user_id, referral_code=code)
    db.add(new_ref)
    db.commit()
    return {"referral_code": code}

@router.post("/points/add")
def add_points(point_data: schemas.GadiPointCreate, db: Session = Depends(get_db)):
    new_points = models.GadiPoint(
        user_id=point_data.user_id, 
        points=point_data.points, 
        action_type=point_data.action_type
    )
    db.add(new_points)
    db.commit()
    
    # Check for new achievements
    total = db.query(func.sum(models.GadiPoint.points)).filter(models.GadiPoint.user_id == point_data.user_id).scalar() or 0
    eligible = db.query(models.Achievement).filter(models.Achievement.point_threshold <= total).all()
    
    for ach in eligible:
        already_earned = db.query(models.UserAchievement).filter(models.UserAchievement.user_id == user_id, models.UserAchievement.achievement_id == ach.id).first()
        if not already_earned:
            ua = models.UserAchievement(user_id=user_id, achievement_id=ach.id)
            db.add(ua)
    
    db.commit()
    return {"status": "success", "total_points": total}
