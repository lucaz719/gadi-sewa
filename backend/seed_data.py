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
    print("🗑️  Clearing existing data...")
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
    print("✅ Database cleared")

def seed_plans(db: Session):
    """Seed subscription plans"""
    print("💳 Seeding plans...")
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
    print("🏢 Seeding enterprises...")
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
    print("👤 Seeding system users...")
    
    # We use simple "hashed_" prefix to simulate hashing for this manual system setup
    users = [
        {"email": "admin@gadisewa.com", "hashed_password": "hashed_Admin@123", "full_name": "System Administrator", "role": "admin"},
        {"email": "garage@gadisewa.com", "hashed_password": "hashed_Test@123", "full_name": "Main Garage Owner", "role": "garage", "enterprise_id": 1},
        {"email": "vendor@gadisewa.com", "hashed_password": "hashed_Test@123", "full_name": "Parts Vendor", "role": "vendor", "enterprise_id": 2},
        {"email": "customer@gadisewa.com", "hashed_password": "hashed_Test@123", "full_name": "John Doe", "role": "customer"},
    ]
    
    for user_data in users:
        user = models.User(**user_data)
        db.add(user)
    
    db.commit()
    print(f"✅ Added {len(users)} core system users")

def seed_inventory(db: Session):
    """Seed inventory with realistic automotive parts"""
    print("📦 Seeding inventory...")
    
    inventory_items = [
        # Engine Parts
        {"name": "Engine Oil 5W-30", "sku": "EO-5W30-001", "category": "Oils", "vehicle_type": "Car", "stock": 50, "price": 2500.0, "unit": "liter"},
        {"name": "Engine Oil 10W-40", "sku": "EO-10W40-001", "category": "Oils", "vehicle_type": "Car", "stock": 35, "price": 2800.0, "unit": "liter"},
        {"name": "Oil Filter", "sku": "OF-001", "category": "Filters", "vehicle_type": "Car", "stock": 100, "price": 450.0, "unit": "piece"},
        {"name": "Air Filter", "sku": "AF-001", "category": "Filters", "vehicle_type": "Car", "stock": 75, "price": 650.0, "unit": "piece"},
        
        # Brake Parts
        {"name": "Brake Pads Front", "sku": "BP-F-001", "category": "Brakes", "vehicle_type": "Car", "stock": 40, "price": 3500.0, "unit": "set"},
        {"name": "Brake Pads Rear", "sku": "BP-R-001", "category": "Brakes", "vehicle_type": "Car", "stock": 35, "price": 3200.0, "unit": "set"},
        {"name": "Brake Fluid DOT 4", "sku": "BF-DOT4-001", "category": "Fluids", "vehicle_type": "Car", "stock": 60, "price": 850.0, "unit": "liter"},
        
        # Tires & Wheels
        {"name": "Tire 195/65R15", "sku": "TR-195-65-15", "category": "Tires", "vehicle_type": "Car", "stock": 20, "price": 8500.0, "unit": "piece"},
        {"name": "Tire 205/55R16", "sku": "TR-205-55-16", "category": "Tires", "vehicle_type": "Car", "stock": 15, "price": 9500.0, "unit": "piece"},
        
        # Electrical
        {"name": "Car Battery 12V 65Ah", "sku": "BAT-12V-65", "category": "Electrical", "vehicle_type": "Car", "stock": 25, "price": 12000.0, "unit": "piece"},
        {"name": "Spark Plugs Set", "sku": "SP-SET-001", "category": "Electrical", "vehicle_type": "Car", "stock": 50, "price": 1200.0, "unit": "set"},
        
        # Coolant & Fluids
        {"name": "Coolant Antifreeze", "sku": "CL-AF-001", "category": "Fluids", "vehicle_type": "Car", "stock": 45, "price": 1500.0, "unit": "liter"},
        {"name": "Transmission Fluid", "sku": "TF-001", "category": "Fluids", "vehicle_type": "Car", "stock": 30, "price": 1800.0, "unit": "liter"},
        
        # Bike Parts
        {"name": "Bike Engine Oil 20W-50", "sku": "BEO-20W50", "category": "Oils", "vehicle_type": "Bike", "stock": 80, "price": 850.0, "unit": "liter"},
        {"name": "Bike Chain Sprocket Kit", "sku": "BCS-KIT-001", "category": "Transmission", "vehicle_type": "Bike", "stock": 30, "price": 4500.0, "unit": "set"},
    ]
    
    for item_data in inventory_items:
        item = models.InventoryItem(**item_data)
        db.add(item)
    
    db.commit()
    print(f"✅ Added {len(inventory_items)} inventory items")

def seed_jobs(db: Session):
    """Seed job cards with realistic service requests"""
    print("🔧 Seeding jobs...")
    
    jobs = [
        {
            "customer_id": 1,
            "vehicle_info": "Toyota Camry 2020 - NPL 1234",
            "complaint": "Engine making unusual noise and vibrating during acceleration",
            "status": "Pending",
            "labor_cost": 5000.0
        },
        {
            "customer_id": 2,
            "vehicle_info": "Honda Civic 2019 - NPL 5678",
            "complaint": "Brake pedal feels soft and making squeaking sound",
            "status": "In Progress",
            "labor_cost": 3500.0
        },
        {
            "customer_id": 3,
            "vehicle_info": "Hyundai i20 2021 - NPL 9012",
            "complaint": "AC not cooling properly, blowing warm air",
            "status": "Completed",
            "labor_cost": 4000.0
        },
        {
            "customer_id": 4,
            "vehicle_info": "Suzuki Swift 2018 - NPL 3456",
            "complaint": "Check engine light on, car jerking occasionally",
            "status": "Pending",
            "labor_cost": 6000.0
        },
        {
            "customer_id": 5,
            "vehicle_info": "Yamaha FZ 2022 - NPL 7890",
            "complaint": "Bike not starting, battery seems dead",
            "status": "In Progress",
            "labor_cost": 2000.0
        },
    ]
    
    for job_data in jobs:
        job = models.Job(**job_data)
        db.add(job)
    
    db.commit()
    print(f"✅ Added {len(jobs)} job cards")

def seed_transactions(db: Session):
    """Seed financial transactions"""
    print("💰 Seeding transactions...")
    
    transactions = [
        {
            "id": str(uuid.uuid4()),
            "type": "Income",
            "amount": 15000.0,
            "category": "Service",
            "description": "Full service - Toyota Camry",
            "timestamp": datetime.utcnow() - timedelta(days=5)
        },
        {
            "id": str(uuid.uuid4()),
            "type": "Income",
            "amount": 8500.0,
            "category": "Parts",
            "description": "Brake pads replacement",
            "timestamp": datetime.utcnow() - timedelta(days=4)
        },
        {
            "id": str(uuid.uuid4()),
            "type": "Expense",
            "amount": 25000.0,
            "category": "Inventory",
            "description": "Bulk purchase - Engine oils",
            "timestamp": datetime.utcnow() - timedelta(days=3)
        },
        {
            "id": str(uuid.uuid4()),
            "type": "Income",
            "amount": 12000.0,
            "category": "Service",
            "description": "AC repair - Honda Civic",
            "timestamp": datetime.utcnow() - timedelta(days=2)
        },
        {
            "id": str(uuid.uuid4()),
            "type": "Expense",
            "amount": 5000.0,
            "category": "Utilities",
            "description": "Electricity bill",
            "timestamp": datetime.utcnow() - timedelta(days=1)
        },
    ]
    
    for txn_data in transactions:
        txn = models.Transaction(**txn_data)
        db.add(txn)
    
    db.commit()
    print(f"✅ Added {len(transactions)} transactions")

def seed_achievements(db: Session):
    print("🏆 Seeding achievements...")
    achievements = [
        {"name": "Early Adopter", "description": "Joined GadiSewa during the revolution.", "icon": "verified", "point_threshold": 0},
        {"name": "Road Warrior", "description": "Completed 5 services.", "icon": "directions_car", "point_threshold": 1000},
        {"name": "Tech Savvy", "description": "Used AI Assistant 10 times.", "icon": "psychology", "point_threshold": 500},
        {"name": "Networker", "description": "Referred a friend.", "icon": "share", "point_threshold": 100},
    ]
    for a in achievements:
        db_ach = models.Achievement(**a)
        db.add(db_ach)
    db.commit()

def main():
    """Main seeding function"""
    print("\n" + "="*60)
    print("🌱 GADISEWA DATABASE SEEDING")
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
        # seed_jobs(db) # Skipped to have a clean slate for user
        # seed_transactions(db)
        
        print("\n" + "="*60)
        print("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("="*60 + "\n")
        
        print("📊 Summary:")
        print(f"   - Inventory Items: {db.query(models.InventoryItem).count()}")
        print(f"   - Job Cards: {db.query(models.Job).count()}")
        print(f"   - Transactions: {db.query(models.Transaction).count()}")
        print()
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
