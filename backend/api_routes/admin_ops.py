from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from services.admin_service import log_activity

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

# User Management
@router.get("/users", response_model=List[schemas.User])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.User).offset(skip).limit(limit).all()

# Enterprise Registration/Approval
@router.post("/register-interest")
def register_interest(enterprise: schemas.PendingEnterpriseBase, db: Session = Depends(get_db)):
    db_pending = models.PendingEnterprise(**enterprise.model_dump())
    db.add(db_pending)
    db.commit()
    db.refresh(db_pending)
    return {"status": "success", "message": "interest registered", "id": db_pending.id}

@router.get("/pending-registrations", response_model=List[schemas.PendingEnterprise])
def get_pending_registrations(db: Session = Depends(get_db)):
    return db.query(models.PendingEnterprise).filter(models.PendingEnterprise.status == "Pending").all()

@router.post("/registrations/{reg_id}/approve")
def approve_registration(reg_id: int, db: Session = Depends(get_db)):
    pending = db.query(models.PendingEnterprise).filter(models.PendingEnterprise.id == reg_id).first()
    if not pending:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    # 1. Create the Enterprise
    db_ent = models.Enterprise(
        name=pending.name,
        type=pending.type,
        owner=pending.owner,
        email=pending.email,
        plan_id=pending.plan_id,
        status="Active"
    )
    db.add(db_ent)
    db.flush()

    # 2. Create the Owner User
    password = f"{pending.email.split('@')[0]}@123"
    db_user = models.User(
        email=pending.email,
        hashed_password=f"hashed_{password}",
        full_name=pending.owner,
        role="garage" if pending.type == "Garage" else "vendor",
        enterprise_id=db_ent.id,
        is_active=True
    )
    db.add(db_user)
    
    # 3. Mark pending as processed
    pending.status = "Approved"
    
    db.commit()
    log_activity(db, "Approve Enterprise", "Enterprise", f"Approved {db_ent.name}")
    
    return {"status": "success", "enterprise_id": db_ent.id, "password": password}

@router.post("/registrations/{reg_id}/reject")
def reject_registration(reg_id: int, db: Session = Depends(get_db)):
    pending = db.query(models.PendingEnterprise).filter(models.PendingEnterprise.id == reg_id).first()
    if not pending:
        raise HTTPException(status_code=404, detail="Registration not found")
    pending.status = "Rejected"
    db.commit()
    return {"status": "success"}

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
    
    log_activity(db, "Create Enterprise", "Enterprise", f"Created enterprise: {db_ent.name}")
    
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

# Plans Management
@router.get("/plans", response_model=List[schemas.Plan])
def list_plans(db: Session = Depends(get_db)):
    return db.query(models.Plan).all()

@router.post("/plans", response_model=schemas.Plan)
def create_or_update_plan(plan: schemas.PlanBase, db: Session = Depends(get_db)):
    db_plan = db.query(models.Plan).filter(models.Plan.id == plan.id).first()
    if db_plan:
        db_plan.name = plan.name
        db_plan.price = plan.price
        db_plan.features = plan.features
        db_plan.duration = plan.duration
    else:
        db_plan = models.Plan(**plan.model_dump())
        db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    log_activity(db, "Manage Plan", "Plan", f"Created or Updated plan: {plan.name}")
    return db_plan

@router.delete("/plans/{plan_id}")
def delete_plan(plan_id: str, db: Session = Depends(get_db)):
    db_plan = db.query(models.Plan).filter(models.Plan.id == plan_id).first()
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    db.delete(db_plan)
    db.commit()
    log_activity(db, "Manage Plan", "Plan", f"Deleted plan: {plan_id}")
    return {"status": "success", "deleted_id": plan_id}

@router.patch("/enterprises/{ent_id}/plan")
def update_enterprise_plan(ent_id: int, payload: dict, db: Session = Depends(get_db)):
    ent = db.query(models.Enterprise).filter(models.Enterprise.id == ent_id).first()
    if not ent:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    plan_id = payload.get("plan_id")
    if plan_id:
        ent.plan_id = plan_id
        db.commit()
        log_activity(db, "Update Plan", "Enterprise", f"Updated enterprise {ent_id} to plan {plan_id}")
    return {"status": "success", "enterprise_id": ent_id, "new_plan_id": ent.plan_id}

# Activity Logs
@router.get("/logs", response_model=List[schemas.ActivityLog])
def list_logs(limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(limit).all()

# Admin Stats
@router.get("/stats", response_model=schemas.AdminStats)
def get_admin_stats(db: Session = Depends(get_db)):
    from services.admin_service import get_admin_stats
    stats = get_admin_stats(db)
    total_jobs = db.query(models.Job).count()
    active_subs = db.query(models.Enterprise).filter(models.Enterprise.status == "Active").count()
    
    # Calculate MRR (Monthly Recurring Revenue)
    # Simple MRR: Sum of prices of plans for all active enterprises
    total_mrr = 0.0
    enterprises = db.query(models.Enterprise).filter(models.Enterprise.status == "Active").all()
    plan_ids = [e.plan_id for e in enterprises if e.plan_id]
    if plan_ids:
        plans = db.query(models.Plan).filter(models.Plan.id.in_(plan_ids)).all()
        plan_price_map = {p.id: p.price for p in plans}
        for e in enterprises:
            total_mrr += plan_price_map.get(e.plan_id, 0.0)
            
    # Calculate Churn Rate (simplified: Pending/Inactive split over total)
    total_ents = db.query(models.Enterprise).count()
    inactive_ents = db.query(models.Enterprise).filter(models.Enterprise.status != "Active").count()
    churn_rate = (inactive_ents / max(total_ents, 1)) * 100
    
    stats["total_jobs"] = total_jobs
    stats["active_subscriptions"] = active_subs
    stats["mrr"] = round(total_mrr, 2)
    stats["churn_rate"] = round(churn_rate, 1)
    
    return stats

# Growth Data
@router.get("/growth-data")
def get_growth_data(db: Session = Depends(get_db)):
    from sqlalchemy import extract
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    result = []
    for i in range(1, 13):
        garages = db.query(models.Enterprise).filter(
            models.Enterprise.type == "Garage",
            extract("month", models.Enterprise.created_at) == i
        ).count()
        vendors = db.query(models.Enterprise).filter(
            models.Enterprise.type == "Vendor",
            extract("month", models.Enterprise.created_at) == i
        ).count()
        result.append({"month": months[i-1], "garages": garages, "vendors": vendors})
    return result

# Revenue Analytics
@router.get("/revenue-analytics")
def get_revenue_analytics(db: Session = Depends(get_db)):
    from sqlalchemy import func, extract
    total_revenue = db.query(func.sum(models.Transaction.amount)).filter(models.Transaction.type == "Income").scalar() or 0.0
    active_subs = db.query(models.Enterprise).filter(models.Enterprise.status == "Active").count()
    
    # Revenue by type
    garage_ids = [e.id for e in db.query(models.Enterprise).filter(models.Enterprise.type == "Garage").all()]
    vendor_ids = [e.id for e in db.query(models.Enterprise).filter(models.Enterprise.type == "Vendor").all()]
    garage_rev = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.type == "Income", models.Transaction.enterprise_id.in_(garage_ids)
    ).scalar() or 0.0
    vendor_rev = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.type == "Income", models.Transaction.enterprise_id.in_(vendor_ids)
    ).scalar() or 0.0
    
    # Monthly trend
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    monthly_trend = []
    for i in range(1, 13):
        m_rev = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.type == "Income",
            extract("month", models.Transaction.timestamp) == i
        ).scalar() or 0.0
        monthly_trend.append({"month": months[i-1], "revenue": round(m_rev, 2)})
    
    # Top enterprises
    top_ents = []
    for ent in db.query(models.Enterprise).filter(models.Enterprise.status == "Active").limit(5).all():
        rev = db.query(func.sum(models.Transaction.amount)).filter(
            models.Transaction.type == "Income", models.Transaction.enterprise_id == ent.id
        ).scalar() or 0.0
        top_ents.append({"id": ent.id, "name": ent.name, "type": ent.type, "revenue": round(rev, 2)})
    top_ents.sort(key=lambda x: x["revenue"], reverse=True)
    
    return {
        "total_revenue": round(total_revenue, 2),
        "active_subscriptions": active_subs,
        "mrr": round(total_revenue / max(active_subs, 1), 2),
        "garage_revenue": round(garage_rev, 2),
        "vendor_revenue": round(vendor_rev, 2),
        "monthly_trend": monthly_trend,
        "top_enterprises": top_ents[:5]
    }

# Enterprise Detail
@router.get("/enterprises/{ent_id}/detail")
def get_enterprise_detail(ent_id: int, db: Session = Depends(get_db)):
    from sqlalchemy import func
    ent = db.query(models.Enterprise).filter(models.Enterprise.id == ent_id).first()
    if not ent:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    
    total_jobs = db.query(models.Job).filter(models.Job.customer_id.in_(
        db.query(models.Customer.id).filter(models.Customer.enterprise_id == ent_id)
    )).count()
    revenue = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.type == "Income", models.Transaction.enterprise_id == ent_id
    ).scalar() or 0.0
    staff_count = db.query(models.User).filter(models.User.enterprise_id == ent_id).count()
    inventory_value = db.query(func.sum(models.InventoryItem.price * models.InventoryItem.stock)).scalar() or 0.0
    plan = db.query(models.Plan).filter(models.Plan.id == ent.plan_id).first()
    
    recent_logs = db.query(models.ActivityLog).filter(
        models.ActivityLog.details.contains(str(ent_id)) | models.ActivityLog.details.contains(ent.name)
    ).order_by(models.ActivityLog.timestamp.desc()).limit(10).all()
    
    return {
        "enterprise": {
            "id": ent.id, "name": ent.name, "type": ent.type, "owner": ent.owner,
            "email": ent.email, "status": ent.status, "is_active": ent.is_active,
            "created_at": str(ent.created_at), "plan_id": ent.plan_id
        },
        "plan": {"id": plan.id, "name": plan.name, "price": plan.price, "duration": plan.duration} if plan else None,
        "stats": {
            "total_jobs": total_jobs, "revenue": round(revenue, 2),
            "staff_count": staff_count, "inventory_value": round(inventory_value, 2)
        },
        "recent_activity": [
            {"id": l.id, "action": l.action, "entity": l.entity, "details": l.details, "timestamp": str(l.timestamp)}
            for l in recent_logs
        ]
    }

# Platform Settings
@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.PlatformSettings).all()
    result = {}
    for s in settings:
        if s.value.lower() in ('true', 'false'):
            result[s.key] = s.value.lower() == 'true'
        else:
            try:
                result[s.key] = int(s.value)
            except ValueError:
                result[s.key] = s.value
    return result

@router.post("/settings")
def save_settings(payload: schemas.PlatformSettingsUpdate, db: Session = Depends(get_db)):
    for key, value in payload.model_dump().items():
        existing = db.query(models.PlatformSettings).filter(models.PlatformSettings.key == key).first()
        if existing:
            existing.value = str(value)
        else:
            db.add(models.PlatformSettings(key=key, value=str(value)))
    db.commit()
    log_activity(db, "Update Settings", "Platform", "Platform settings updated")
    return {"status": "success"}

# Notifications
@router.get("/notifications", response_model=List[schemas.NotificationOut])
def list_notifications(db: Session = Depends(get_db)):
    return db.query(models.Notification).order_by(models.Notification.created_at.desc()).limit(50).all()

@router.post("/notifications", response_model=schemas.NotificationOut)
def create_notification(notif: schemas.NotificationBase, db: Session = Depends(get_db)):
    db_notif = models.Notification(**notif.model_dump())
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    log_activity(db, "Create Notification", "Notification", f"Broadcast: {notif.title}")
    return db_notif

@router.patch("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"status": "success"}
