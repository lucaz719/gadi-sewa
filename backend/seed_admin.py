"""
Seed script for GadiSewa Admin Panel.
Seeds default plans, admin user, and platform settings.
Run: python seed_admin.py
"""
from database import engine, Base, SessionLocal
import models

def seed():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Seed Plans
    default_plans = [
        {"id": "PLAN-FREE", "name": "Free Tier", "price": 0, "features": ["3 Jobs/month", "1 Staff Account", "Basic Reports"], "duration": "Lifetime"},
        {"id": "PLAN-PRO", "name": "Garage Pro", "price": 2999, "features": ["Unlimited Jobs", "5 Staff Accounts", "Marketplace Access", "Advanced Reports", "Priority Support"], "duration": "Monthly"},
        {"id": "PLAN-ENTERPRISE", "name": "Enterprise", "price": 7999, "features": ["Unlimited Everything", "Unlimited Staff", "Marketplace + API", "Custom Branding", "Dedicated Support", "White-Label"], "duration": "Monthly"},
    ]
    for plan_data in default_plans:
        existing = db.query(models.Plan).filter(models.Plan.id == plan_data["id"]).first()
        if not existing:
            db.add(models.Plan(**plan_data))
            print(f"  + Seeded plan: {plan_data['name']}")
        else:
            print(f"  = Plan already exists: {plan_data['name']}")
    
    # Seed Admin User
    admin_email = "admin@gadisewa.com"
    existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not existing_admin:
        from api_routes.auth import hash_password
        db.add(models.User(
            email=admin_email,
            hashed_password=hash_password("admin@123"),
            full_name="GadiSewa Admin",
            role="admin",
            is_active=True
        ))
        print(f"  + Seeded admin user: {admin_email}")
    else:
        print(f"  = Admin user already exists: {admin_email}")
    
    # Seed Platform Settings
    default_settings = {
        "trial_period_days": "14",
        "max_users_basic": "3",
        "maintenance_mode": "False",
        "registration_freeze": "False"
    }
    for key, value in default_settings.items():
        existing = db.query(models.PlatformSettings).filter(models.PlatformSettings.key == key).first()
        if not existing:
            db.add(models.PlatformSettings(key=key, value=value))
            print(f"  + Seeded setting: {key} = {value}")
        else:
            print(f"  = Setting already exists: {key}")
    
    db.commit()
    db.close()
    print("\n[OK] Seed complete!")

if __name__ == "__main__":
    print("[SEED] Seeding GadiSewa database...\n")
    seed()
