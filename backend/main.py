from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base, SessionLocal
import models
from api_routes import (
    jobs, inventory, ai, financials, pos, auth, 
    admin_ops, gamification, ai_assistant, reports, 
    crm_ops, staff, appointment_ops, support_ops, billing_ops, marketplace_ops
)

# Initialize database
models.Base.metadata.create_all(bind=engine)


def _seed_default_users() -> None:
    """Seed default users when the database has no users (first run only)."""
    import logging
    from api_routes.auth import hash_password

    db = SessionLocal()
    try:
        # Always check if database is empty, regardless of PRODUCTION setting
        # This ensures first-run setup works in all environments
        if db.query(models.User).count() > 0:
            return

        logging.info("Empty database detected — seeding default users.")

        # Ensure required plans and enterprises exist first
        if not db.query(models.Plan).filter_by(id="PLAN-PRO").first():
            db.add(models.Plan(id="PLAN-PRO", name="Garage Pro", price=2999.0,
                               features=["Unlimited Jobs", "5 Staff", "Marketplace"],
                               duration="Monthly"))
            db.add(models.Plan(id="PLAN-FREE", name="Free Tier", price=0.0,
                               features=["3 Jobs/mo", "1 Staff"], duration="Lifetime"))
            db.flush()

        if not db.query(models.Enterprise).filter_by(id=1).first():
            db.add(models.Enterprise(id=1, name="GadiSewa Main Garage", type="Garage",
                                     owner="Garage Owner", email="garage@gadisewa.com",
                                     plan_id="PLAN-PRO"))
        if not db.query(models.Enterprise).filter_by(id=2).first():
            db.add(models.Enterprise(id=2, name="Babal Parts Supply", type="Vendor",
                                     owner="Vendor Owner", email="vendor@gadisewa.com",
                                     plan_id="PLAN-PRO"))
        db.flush()

        default_users = [
            {"email": "admin@gadisewa.com", "hashed_password": hash_password("admin@123"),
             "full_name": "System Administrator", "role": "admin"},
            {"email": "garage@gadisewa.com", "hashed_password": hash_password("Test@123"),
             "full_name": "Main Garage Owner", "role": "garage", "enterprise_id": 1},
            {"email": "vendor@gadisewa.com", "hashed_password": hash_password("Test@123"),
             "full_name": "Parts Vendor", "role": "vendor", "enterprise_id": 2},
            {"email": "customer@gadisewa.com", "hashed_password": hash_password("Test@123"),
             "full_name": "John Doe", "role": "customer"},
        ]
        for user_data in default_users:
            db.add(models.User(**user_data))
        db.commit()
        logging.info("Default users seeded successfully.")
    except Exception as exc:
        db.rollback()
        logging.error("Failed to seed default users: %s", exc)
    finally:
        db.close()


_seed_default_users()

app = FastAPI(title="GadiSewa Backend API")

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(jobs.router)
app.include_router(inventory.router)
app.include_router(ai.router)
app.include_router(financials.router)
app.include_router(pos.router)
app.include_router(auth.router)
app.include_router(admin_ops.router)
app.include_router(gamification.router)
app.include_router(ai_assistant.router)
app.include_router(reports.router)
app.include_router(crm_ops.router)
app.include_router(staff.router)
app.include_router(appointment_ops.router)
app.include_router(support_ops.router)
app.include_router(billing_ops.router)
app.include_router(marketplace_ops.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to GadiSewa API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "gadisewa-api"}
