from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/crm", tags=["CRM"])

@router.get("/summary", response_model=schemas.CRMSummary)
def get_crm_summary(enterprise_id: int = None, db: Session = Depends(get_db)):
    if not enterprise_id:
        return {
            "total_customers": 0,
            "due_for_service": 0,
            "upcoming_followups": 0,
            "followup_rate": 0.0
        }
        
    # Filter by enterprise_id
    total_customers = db.query(models.Customer).filter(models.Customer.enterprise_id == enterprise_id).count()
    
    today = datetime.utcnow()
    # Customers due for service within the next 7 days or overdue
    due_query = db.query(models.Customer).filter(
        models.Customer.enterprise_id == enterprise_id,
        models.Customer.next_service_date <= today + timedelta(days=7)
    )
    due_for_service = due_query.count()
    
    # Upcoming followups (next 14 days)
    upcoming_query = db.query(models.Customer).filter(
        models.Customer.enterprise_id == enterprise_id,
        models.Customer.next_service_date > today,
        models.Customer.next_service_date <= today + timedelta(days=14)
    )
    upcoming_followups = upcoming_query.count()
    
    # Calculate follow-up rate from real data
    if total_customers > 0:
        customers_with_followup = db.query(models.Customer).filter(
            models.Customer.enterprise_id == enterprise_id,
            models.Customer.next_service_date.isnot(None)
        ).count()
        followup_rate = round((customers_with_followup / total_customers) * 100, 1)
    else:
        followup_rate = 0.0
    
    return {
        "total_customers": total_customers,
        "due_for_service": due_for_service,
        "upcoming_followups": upcoming_followups,
        "followup_rate": followup_rate
    }

@router.get("/followups", response_model=List[schemas.Customer])
def get_followups(enterprise_id: int = None, db: Session = Depends(get_db)):
    if not enterprise_id:
        return []
        
    today = datetime.utcnow()
    # Return customers due for service soon
    return db.query(models.Customer).filter(
        models.Customer.enterprise_id == enterprise_id,
        models.Customer.next_service_date <= today + timedelta(days=14)
    ).order_by(models.Customer.next_service_date.asc()).all()

@router.post("/settings")
def update_crm_settings(settings: dict, enterprise_id: int = None, db: Session = Depends(get_db)):
    if not enterprise_id:
        raise HTTPException(status_code=400, detail="enterprise_id is required")
    db_ent = db.query(models.Enterprise).filter(models.Enterprise.id == enterprise_id).first()
    if not db_ent:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    
    if "service_interval_days" in settings:
        db_ent.service_interval_days = settings["service_interval_days"]
    if "auto_followup" in settings:
        db_ent.auto_followup = settings["auto_followup"]
        
    db.commit()
    return {"status": "success"}

@router.get("/customers", response_model=List[schemas.Customer])
def get_customers(enterprise_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Customer)
    if enterprise_id:
        query = query.filter(models.Customer.enterprise_id == enterprise_id)
    return query.order_by(models.Customer.name.asc()).all()

@router.post("/customers", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerBase, enterprise_id: int = None, db: Session = Depends(get_db)):
    if not enterprise_id:
        raise HTTPException(status_code=400, detail="enterprise_id is required")
    db_customer = models.Customer(**customer.model_dump(), enterprise_id=enterprise_id)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer
