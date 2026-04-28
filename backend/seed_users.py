#!/usr/bin/env python
"""Seed demo users for testing."""
import os
import sys

# Set env vars before importing auth
os.environ["ADMIN_ACCESS_TOKEN"] = "GS-ADMIN-DEV-TOKEN-2026"
os.environ["DATABASE_URL"] = "sqlite:///./gadisewa.db"

from database import engine, SessionLocal, Base
import models

Base.metadata.create_all(bind=engine)

# Now import auth after env is set
from api_routes.auth import hash_password

db = SessionLocal()

# Create plan if missing
plan = db.query(models.Plan).filter_by(id="PLAN-PRO").first()
if not plan:
    plan = models.Plan(id="PLAN-PRO", name="Garage Pro", price=2999.0, features=["Unlimited"], duration="Monthly")
    db.add(plan)
    db.flush()

# Create enterprise if missing
enterprise = db.query(models.Enterprise).first()
if not enterprise:
    enterprise = models.Enterprise(
        name="Demo Garage",
        plan_id="PLAN-PRO",
        type="Garage",
        owner="Owner",
        email="garage@gadisewa.com"
    )
    db.add(enterprise)
    db.flush()

USERS = [
    {"email": "garage@gadisewa.com", "password": "Test@123", "full_name": "Garage Owner", "role": "garage"},
    {"email": "vendor@gadisewa.com", "password": "Test@123", "full_name": "Vendor Owner", "role": "vendor"},
    {"email": "customer@gadisewa.com", "password": "Test@123", "full_name": "Customer User", "role": "customer"},
    {"email": "admin@gadisewa.com", "password": "admin@123", "full_name": "Admin User", "role": "admin"},
]

for u in USERS:
    existing = db.query(models.User).filter_by(email=u["email"]).first()
    hashed = hash_password(u["password"])
    
    if existing:
        existing.hashed_password = hashed
        print(f"✓ Updated {u['email']}")
    else:
        user = models.User(
            email=u["email"],
            hashed_password=hashed,
            full_name=u["full_name"],
            role=u["role"],
            is_active=True,
            enterprise_id=enterprise.id if u["role"] in ("garage", "vendor") else None
        )
        db.add(user)
        print(f"✓ Created {u['email']}")

db.commit()
db.close()

print("\n✓ Seeding complete!")
print("Ready to login with:")
print("  garage@gadisewa.com / Test@123")
print("  vendor@gadisewa.com / Test@123")
print("  customer@gadisewa.com / Test@123")
print("  admin@gadisewa.com / admin@123")
