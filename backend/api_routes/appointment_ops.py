from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from api_routes.dependencies import get_current_user

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/", response_model=List[schemas.Appointment])
def list_appointments(enterprise_id: int, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return db.query(models.Appointment).filter(models.Appointment.enterprise_id == enterprise_id).all()

@router.post("/", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentBase, enterprise_id: int, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_app = models.Appointment(**appointment.model_dump(), enterprise_id=enterprise_id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.patch("/{app_id}/status")
def update_appointment_status(app_id: int, status_update: dict, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_app = db.query(models.Appointment).filter(models.Appointment.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db_app.status = status_update.get("status", db_app.status)
    db.commit()
    return {"status": "success", "new_status": db_app.status}
