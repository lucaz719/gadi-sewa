from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from api_routes.dependencies import get_current_user

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/", response_model=schemas.InventoryItem)
def create_inventory_item(item: schemas.InventoryItemBase, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_item = models.InventoryItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[schemas.InventoryItem])
def get_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    return db.query(models.InventoryItem).offset(skip).limit(limit).all()

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}

class StockUpdate(schemas.BaseModel):
    skuOrName: str
    change: int

@router.post("/update-stock")
def update_stock(update: StockUpdate, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    db_item = db.query(models.InventoryItem).filter(
        (models.InventoryItem.sku == update.skuOrName) | (models.InventoryItem.name == update.skuOrName)
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.stock += update.change
    db.commit()
    return {"message": "Stock updated", "new_stock": db_item.stock}
