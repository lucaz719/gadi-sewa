from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas

router = APIRouter(prefix="/support", tags=["Support Tickets"])

@router.get("/tickets", response_model=List[schemas.SupportTicket])
def list_tickets(enterprise_id: int = None, db: Session = Depends(get_db)):
    if enterprise_id:
        return db.query(models.SupportTicket).filter(models.SupportTicket.enterprise_id == enterprise_id).all()
    return db.query(models.SupportTicket).all()

@router.post("/tickets", response_model=schemas.SupportTicket)
def create_ticket(ticket: schemas.SupportTicketBase, enterprise_id: int, db: Session = Depends(get_db)):
    db_ticket = models.SupportTicket(**ticket.model_dump(), enterprise_id=enterprise_id)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.patch("/tickets/{ticket_id}/status")
def update_ticket_status(ticket_id: int, status_update: dict, db: Session = Depends(get_db)):
    db_ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db_ticket.status = status_update.get("status", db_ticket.status)
    db.commit()
    return {"status": "success", "new_status": db_ticket.status}
