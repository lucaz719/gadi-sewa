from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from datetime import datetime, timedelta

router = APIRouter(prefix="/billing", tags=["Enterprise Billing"])

@router.get("/invoices", response_model=List[schemas.EnterpriseInvoice])
def list_enterprise_invoices(enterprise_id: int = None, db: Session = Depends(get_db)):
    if enterprise_id:
        return db.query(models.EnterpriseInvoice).filter(models.EnterpriseInvoice.enterprise_id == enterprise_id).all()
    return db.query(models.EnterpriseInvoice).all()

@router.post("/generate-invoice")
def generate_monthly_invoice(enterprise_id: int, db: Session = Depends(get_db)):
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
