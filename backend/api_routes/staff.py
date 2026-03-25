from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/staff", tags=["Staff Management"])

@router.get("/", response_model=List[schemas.StaffMember])
def list_staff(enterprise_id: int, db: Session = Depends(get_db)):
    return db.query(models.StaffMember).filter(models.StaffMember.enterprise_id == enterprise_id).all()

@router.post("/", response_model=schemas.StaffMember)
def create_staff(staff: schemas.StaffMemberBase, enterprise_id: int, db: Session = Depends(get_db)):
    db_staff = models.StaffMember(**staff.model_dump(), enterprise_id=enterprise_id)
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.patch("/{staff_id}", response_model=schemas.StaffMember)
def update_staff(staff_id: int, staff_update: dict, db: Session = Depends(get_db)):
    db_staff = db.query(models.StaffMember).filter(models.StaffMember.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    for key, value in staff_update.items():
        setattr(db_staff, key, value)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.delete("/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    db_staff = db.query(models.StaffMember).filter(models.StaffMember.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(db_staff)
    db.commit()
    return {"status": "success"}
