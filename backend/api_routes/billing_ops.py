from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from datetime import datetime, timedelta
from api_routes.dependencies import require_role, resolve_enterprise_access

router = APIRouter(prefix="/billing", tags=["Enterprise Billing"])

@router.get("/invoices", response_model=List[schemas.EnterpriseInvoice])
def list_enterprise_invoices(enterprise_id: int = None, db: Session = Depends(get_db), user=Depends(require_role("garage", "vendor", "admin"))):
    query = db.query(models.EnterpriseInvoice)
    if user.role != "admin" or enterprise_id is not None:
        enterprise_id = resolve_enterprise_access(user, enterprise_id)
        query = query.filter(models.EnterpriseInvoice.enterprise_id == enterprise_id)
    return query.all()

@router.post("/generate-invoice")
def generate_monthly_invoice(enterprise_id: int, db: Session = Depends(get_db), user=Depends(require_role("garage", "vendor", "admin"))):
    enterprise_id = resolve_enterprise_access(user, enterprise_id)
    ent = db.query(models.Enterprise).filter(models.Enterprise.id == enterprise_id).first()
    if not ent:
        raise HTTPException(status_code=404, detail="Enterprise not found")
    
    plan = db.query(models.Plan).filter(models.Plan.id == ent.plan_id).first()
    amount = plan.price if plan else 0.0
    
    month_name = datetime.now().strftime("%B %Y")
    inv_num = f"INV-{enterprise_id}-{datetime.now().strftime('%Y%m%d%H%M')}"
    
    db_invoice = models.EnterpriseInvoice(
        enterprise_id=enterprise_id,
        invoice_number=inv_num,
        amount=amount,
        status="Unpaid",
        due_date=datetime.now() + timedelta(days=7),
        billing_month=month_name
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice
