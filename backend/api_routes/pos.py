from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
import json

router = APIRouter(prefix="/pos", tags=["POS"])

@router.post("/held-carts", response_model=schemas.HeldCart)
def hold_cart(cart: schemas.HeldCartBase, db: Session = Depends(get_db)):
    """Hold a cart for later recall"""
    db_cart = models.HeldCart(**cart.model_dump())
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

@router.get("/held-carts", response_model=list[schemas.HeldCart])
def get_held_carts(db: Session = Depends(get_db)):
    """Retrieve all held carts"""
    return db.query(models.HeldCart).order_by(models.HeldCart.created_at.desc()).all()

@router.delete("/held-carts/{cart_id}")
def remove_held_cart(cart_id: int, db: Session = Depends(get_db)):
    """Remove a held cart"""
    db_cart = db.query(models.HeldCart).filter(models.HeldCart.id == cart_id).first()
    if not db_cart:
        raise HTTPException(status_code=404, detail="Held cart not found")
    db.delete(db_cart)
    db.commit()
    return {"message": "Held cart removed successfully"}
