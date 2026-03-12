from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

# User Management
@router.get("/users", response_model=List[schemas.User])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.User).offset(skip).limit(limit).all()

@router.patch("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"status": "success", "user_id": user_id, "is_active": user.is_active}

@router.patch("/users/{user_id}/reset-password")
def reset_user_password(user_id: int, body: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_password = body.get("password", f"{user.email.split('@')[0]}@123")
    user.hashed_password = f"hashed_{new_password}"
    db.commit()
    return {"status": "success", "user_id": user_id, "new_password": new_password}


# Enterprise Management
@router.get("/enterprises", response_model=List[schemas.Enterprise])
def list_enterprises(db: Session = Depends(get_db)):
    return db.query(models.Enterprise).all()

@router.post("/enterprises")
def create_enterprise(enterprise: schemas.EnterpriseCreate, db: Session = Depends(get_db)):
    # 1. Create the Enterprise record
    ent_data = enterprise.model_dump(exclude={"password"})
    db_ent = models.Enterprise(**ent_data)
    db.add(db_ent)
    db.flush()  # Get the ID before committing

    # 2. Create a User record with login credentials
    password = enterprise.password or f"{enterprise.email.split('@')[0]}@123"
    role = "garage" if enterprise.type == "Garage" else "vendor"
    
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == enterprise.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail=f"A user with email {enterprise.email} already exists"
        )
    
    db_user = models.User(
        email=enterprise.email,
        hashed_password=f"hashed_{password}",
        full_name=enterprise.owner,
        role=role,
        enterprise_id=db_ent.id,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_ent)
    db.refresh(db_user)
    
    return {
        "enterprise": db_ent,
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "role": db_user.role,
            "password": password  # Return plaintext so admin can share it
        }
    }


@router.patch("/enterprises/{ent_id}/status")
def update_enterprise_status(ent_id: int, status_update: dict, db: Session = Depends(get_db)):
    ent = db.query(models.Enterprise).filter(models.Enterprise.id == ent_id).first()
    if not ent:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    ent.status = status_update.get("status", ent.status)
    db.commit()
    return {"status": "success", "enterprise_id": ent_id, "new_status": ent.status}

# Voucher Management
@router.post("/vouchers", response_model=schemas.Voucher)
def create_voucher(voucher: schemas.VoucherBase, db: Session = Depends(get_db)):
    db_voucher = models.Voucher(**voucher.model_dump())
    db.add(db_voucher)
    db.commit()
    db.refresh(db_voucher)
    return db_voucher

@router.get("/vouchers", response_model=List[schemas.Voucher])
def list_vouchers(db: Session = Depends(get_db)):
    return db.query(models.Voucher).all()

@router.patch("/vouchers/{voucher_id}/toggle-active")
def toggle_voucher_active(voucher_id: int, db: Session = Depends(get_db)):
    voucher = db.query(models.Voucher).filter(models.Voucher.id == voucher_id).first()
    if not voucher:
        raise HTTPException(status_code=404, detail="Voucher not found")
    voucher.is_active = not voucher.is_active
    db.commit()
    return {"status": "success", "voucher_id": voucher_id, "is_active": voucher.is_active}

# Global Catalog
@router.get("/global-catalog", response_model=List[schemas.GlobalItem])
def get_global_catalog(db: Session = Depends(get_db)):
    return db.query(models.GlobalItem).all()

@router.post("/global-catalog", response_model=List[schemas.GlobalItem])
def update_global_catalog(items: List[schemas.GlobalItemBase], db: Session = Depends(get_db)):
    db.query(models.GlobalItem).delete()
    for item in items:
        db_item = models.GlobalItem(**item.model_dump())
        db.add(db_item)
    db.commit()
    return db.query(models.GlobalItem).all()
