from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from services.crm_service import update_customer_service_dates
from api_routes.dependencies import get_current_user, enforce_resource_enterprise_access, require_role

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=schemas.Job)
def create_job(job: schemas.JobBase, db: Session = Depends(get_db), user=Depends(require_role("garage", "admin"))):
    customer = db.query(models.Customer).filter(models.Customer.id == job.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    enforce_resource_enterprise_access(user, customer.enterprise_id)
    db_job = models.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[schemas.Job])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user=Depends(require_role("garage", "admin"))):
    query = db.query(models.Job)
    if user.role != "admin":
        query = query.join(models.Customer).filter(models.Customer.enterprise_id == user.enterprise_id)
    return query.offset(skip).limit(limit).all()

@router.patch("/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job_update: schemas.JobUpdate, db: Session = Depends(get_db), user=Depends(require_role("garage", "admin"))):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    customer = db.query(models.Customer).filter(models.Customer.id == db_job.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    enforce_resource_enterprise_access(user, customer.enterprise_id)
    
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_job, key, value)
    
    # CRM Logic: If job is completed, update customer service dates
    if db_job.status == "Completed":
        update_customer_service_dates(db, db_job.customer_id)
        
        # Gamification: Award points to the enterprise owner/users
        # Find enterprise for this customer
        customer = db.query(models.Customer).filter(models.Customer.id == db_job.customer_id).first()
        if customer and customer.enterprise_id:
            # Find a user to award points to (proxy for enterprise points)
            user = db.query(models.User).filter(models.User.enterprise_id == customer.enterprise_id).first()
            if user:
                new_points = models.GadiPoint(
                    user_id=user.id,
                    points=50, # 50 points per completed job
                    action_type="Service"
                )
                db.add(new_points)
            
    db.commit()
    db.refresh(db_job)
    return db_job
