from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
from datetime import datetime

def log_activity(db: Session, action: str, entity: str, details: str, user_id: int = None, user_name: str = "System"):
    db_log = models.ActivityLog(
        user_id=user_id,
        user_name=user_name,
        action=action,
        entity=entity,
        details=details
    )
    db.add(db_log)
    db.commit()

def get_admin_stats(db: Session):
    total_garages = db.query(models.Enterprise).filter(models.Enterprise.type == "Garage").count()
    total_vendors = db.query(models.Enterprise).filter(models.Enterprise.type == "Vendor").count()
    total_users = db.query(models.User).count()
    pending = db.query(models.Enterprise).filter(models.Enterprise.status == "Pending").count()
    
    # Calculate revenue from all transactions
    total_revenue = db.query(func.sum(models.Transaction.amount)).filter(models.Transaction.type == "Income").scalar() or 0.0
    
    return {
        "total_garages": total_garages,
        "total_vendors": total_vendors,
        "total_users": total_users,
        "pending_registrations": pending,
        "estimated_revenue": total_revenue
    }
