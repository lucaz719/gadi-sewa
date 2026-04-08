from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from typing import List, Optional
from datetime import datetime
from api_routes.dependencies import get_current_user

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])

@router.get("/products", response_model=List[schemas.VendorProduct])
def get_all_marketplace_products(db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return db.query(models.VendorProduct).all()

@router.get("/vendor/{vendor_id}/products", response_model=List[schemas.VendorProduct])
def get_vendor_products(vendor_id: int, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return db.query(models.VendorProduct).filter(models.VendorProduct.vendor_id == vendor_id).all()

@router.post("/vendor/{vendor_id}/products", response_model=schemas.VendorProduct)
def add_vendor_product(vendor_id: int, product: schemas.VendorProductCreate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_product = models.VendorProduct(**product.dict(), vendor_id=vendor_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.post("/orders", response_model=schemas.VendorOrder)
def place_marketplace_order(order: schemas.VendorOrderCreate, garage_id: int = Query(...), db: Session = Depends(get_db), _user=Depends(get_current_user)):
    # Create the order
    db_order = models.VendorOrder(
        vendor_id=order.vendor_id,
        garage_id=garage_id,
        items=[item.dict() for item in order.items],
        total_amount=order.total_amount
    )
    db.add(db_order)
    
    # Audit log
    new_log = models.ActivityLog(
        user_name=f"Garage #{garage_id}",
        action="Created",
        entity="VendorOrder",
        details=f"Placed order with Vendor #{order.vendor_id} for Rs. {order.total_amount}"
    )
    db.add(new_log)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/vendor/{vendor_id}/orders", response_model=List[schemas.VendorOrder])
def get_vendor_orders(vendor_id: int, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return db.query(models.VendorOrder).filter(models.VendorOrder.vendor_id == vendor_id).all()

@router.patch("/orders/{order_id}/status", response_model=schemas.VendorOrder)
def update_order_status(order_id: int, update: schemas.VendorOrderStatusUpdate, payment_status: Optional[str] = None, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_order = db.query(models.VendorOrder).filter(models.VendorOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_order.status = update.status
    if payment_status:
        db_order.payment_status = payment_status
    
    # Gamification: Award points to garage when order is delivered
    if update.status == "Delivered":
        # Find a user in the garage enterprise
        user = db.query(models.User).filter(models.User.enterprise_id == db_order.garage_id).first()
        if user:
            new_points = models.GadiPoint(
                user_id=user.id,
                points=int(db_order.total_amount / 100), # 1 point per 100 Rs. spent
                action_type="Purchase"
            )
            db.add(new_points)
        
    db.commit()
    db.refresh(db_order)
    return db_order
