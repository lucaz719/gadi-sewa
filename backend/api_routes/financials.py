from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from api_routes.dependencies import get_current_user, require_role, resolve_enterprise_access

router = APIRouter(prefix="/financials", tags=["Financials"])

@router.post("/transactions", response_model=schemas.Transaction)
def log_transaction(txn: schemas.TransactionBase, db: Session = Depends(get_db), user=Depends(require_role("garage", "vendor", "admin"))):
    # Generate a simple ID for the transaction
    import uuid
    # Ensure expense_type is only for Expenses
    expense_type = txn.expense_type if txn.type == "Expense" else None
    txn_data = txn.model_dump()
    txn_data["enterprise_id"] = resolve_enterprise_access(user, txn.enterprise_id)
    db_txn = models.Transaction(**txn_data, id=str(uuid.uuid4()), expense_type=expense_type)
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn

@router.get("/transactions", response_model=List[schemas.Transaction])
def get_transactions(enterprise_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user=Depends(require_role("garage", "vendor", "admin"))):
    query = db.query(models.Transaction)
    if user.role != "admin" or enterprise_id is not None:
        enterprise_id = resolve_enterprise_access(user, enterprise_id)
        query = query.filter(models.Transaction.enterprise_id == enterprise_id)
    return query.order_by(models.Transaction.timestamp.desc()).offset(skip).limit(limit).all()

@router.get("/summary", response_model=schemas.FinancialSummary)
def get_financial_summary(enterprise_id: int = None, db: Session = Depends(get_db), user=Depends(require_role("garage", "vendor", "admin"))):
    query = db.query(models.Transaction)
    if user.role != "admin" or enterprise_id is not None:
        enterprise_id = resolve_enterprise_access(user, enterprise_id)
        query = query.filter(models.Transaction.enterprise_id == enterprise_id)
    
    transactions = query.all()
    
    total_income = sum(t.amount for t in transactions if t.type == "Income")
    total_fixed = sum(t.amount for t in transactions if t.type == "Expense" and t.expense_type == "Fixed")
    total_variable = sum(t.amount for t in transactions if t.type == "Expense" and t.expense_type == "Variable")
    net_profit = total_income - (total_fixed + total_variable)
    
    return {
        "total_income": total_income,
        "total_fixed_expenses": total_fixed,
        "total_variable_expenses": total_variable,
        "net_profit": net_profit,
        "transaction_count": len(transactions)
    }
