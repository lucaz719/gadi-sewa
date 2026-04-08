"""
Database seeding script for GadiSewa test data
Creates realistic test data for all user roles and workflows
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta
import uuid

def clear_database(db: Session):
    """Clear all existing data"""
    print("Clearing existing data...")
    db.query(models.User).delete()
    db.query(models.Enterprise).delete()
    db.query(models.Plan).delete()
    db.query(models.HeldCart).delete()
    db.query(models.Transaction).delete()
    db.query(models.GlobalItem).delete()
    db.query(models.InventoryItem).delete()
    db.query(models.Job).delete()
    db.query(models.Voucher).delete()
    db.query(models.Achievement).delete()
    db.query(models.GadiPoint).delete()
    db.commit()
    print("Database cleared")

def seed_plans(db: Session):
    """Seed subscription plans"""
    print("Seeding plans...")
    plans = [
        {"id": "PLAN-FREE", "name": "Free Tier", "price": 0.0, "features": ["3 Jobs/mo", "1 Staff"], "duration": "Lifetime"},
        {"id": "PLAN-PRO", "name": "Garage Pro", "price": 2999.0, "features": ["Unlimited Jobs", "5 Staff", "Marketplace"], "duration": "Monthly"}
    ]
    for plan_data in plans:
        plan = models.Plan(**plan_data)
        db.add(plan)
    db.commit()

def seed_enterprises(db: Session):
    """Seed default enterprises"""
    print("Seeding enterprises...")
    enterprises = [
        {"id": 1, "name": "GadiSewa Main Garage", "type": "Garage", "owner": "AG Owner", "email": "garage@gadisewa.com", "plan_id": "PLAN-PRO"},
        {"id": 2, "name": "Babal Parts Supply", "type": "Vendor", "owner": "Babal Parts", "email": "vendor@gadisewa.com", "plan_id": "PLAN-PRO"}
    ]
    for ent_data in enterprises:
        ent = models.Enterprise(**ent_data)
        db.add(ent)
    db.commit()

def seed_users(db: Session):
    """Seed official system accounts only"""
    print("Seeding system users...")
    
    from api_routes.auth import hash_password
    
    users = [
        {"email": "admin@gadisewa.com", "hashed_password": hash_password("admin@123"), "full_name": "System Administrator", "role": "admin"},
        {"email": "garage@gadisewa.com", "hashed_password": hash_password("Test@123"), "full_name": "Main Garage Owner", "role": "garage", "enterprise_id": 1},
        {"email": "vendor@gadisewa.com", "hashed_password": hash_password("Test@123"), "full_name": "Parts Vendor", "role": "vendor", "enterprise_id": 2},
        {"email": "customer@gadisewa.com", "hashed_password": hash_password("Test@123"), "full_name": "John Doe", "role": "customer"},
    ]
    
    for user_data in users:
        user = models.User(**user_data)
        db.add(user)
    
    db.commit()
    print(f"Added {len(users)} core system users")

def seed_inventory(db: Session):
    """Seed inventory with realistic automotive parts"""
    print("Seeding inventory...")
    
    inventory_items = [
        {"name": "Engine Oil 5W-30", "sku": "EO-5W30-001", "category": "Oils", "vehicle_type": "Car", "stock": 50, "price": 2500.0, "unit": "liter"},
        {"name": "Oil Filter", "sku": "OF-001", "category": "Filters", "vehicle_type": "Car", "stock": 100, "price": 450.0, "unit": "piece"},
    ]
    
    for item_data in inventory_items:
        item = models.InventoryItem(**item_data)
        db.add(item)
    
    db.commit()

def seed_achievements(db: Session):
    print("Seeding achievements...")
    achievements = [
        {"name": "Early Adopter", "description": "Joined GadiSewa during the revolution.", "icon": "verified", "point_threshold": 0},
    ]
    for a in achievements:
        db_ach = models.Achievement(**a)
        db.add(db_ach)
    db.commit()

def main():
    """Main seeding function"""
    print("\n" + "="*60)
    print("GADISEWA DATABASE SEEDING")
    print("="*60 + "\n")
    
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Clear existing data
        clear_database(db)
        
        # Seed core base data
        seed_plans(db)
        seed_enterprises(db)
        seed_users(db)
        
        # Seed minimal business data
        seed_inventory(db)
        seed_achievements(db)
        
        print("\n" + "="*60)
        print("DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\nError during seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
