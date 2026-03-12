from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=schemas.Job)
def create_job(job: schemas.JobBase, db: Session = Depends(get_db)):
    db_job = models.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[schemas.Job])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Job).offset(skip).limit(limit).all()

@router.patch("/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job_update: schemas.JobUpdate, db: Session = Depends(get_db)):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_job, key, value)
    
    # CRM Logic: If job is completed, update customer service dates
    if db_job.status == "Completed":
        customer = db.query(models.Customer).filter(models.Customer.id == db_job.customer_id).first()
        enterprise = db.query(models.Enterprise).filter(models.Enterprise.id == 1).first() # Default for now
        if customer and enterprise:
            customer.last_service_date = datetime.utcnow()
            interval = enterprise.service_interval_days or 90
            customer.next_service_date = customer.last_service_date + timedelta(days=interval)
            
    db.commit()
    db.refresh(db_job)
    return db_job
