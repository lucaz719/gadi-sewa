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


def _seed_demo_users() -> None:
    """Seed demo accounts on first startup so built-in credentials always work."""
    from api_routes.auth import hash_password

    db = SessionLocal()
    try:
        # Ensure demo enterprises exist before creating linked users
        enterprise_defs = [
            {"id": 1, "name": "GadiSewa Main Garage", "type": "Garage", "owner": "AG Owner", "email": "garage@gadisewa.com"},
            {"id": 2, "name": "Babal Parts Supply", "type": "Vendor", "owner": "Babal Parts", "email": "vendor@gadisewa.com"},
        ]
        for ent_data in enterprise_defs:
            if not db.query(models.Enterprise).filter(models.Enterprise.id == ent_data["id"]).first():
                db.add(models.Enterprise(**ent_data))
        db.commit()

        demo_users = [
            {
                "email": "admin@gadisewa.com",
                "hashed_password": hash_password("Admin@123"),
                "full_name": "System Administrator",
                "role": "admin",
                "is_active": True,
            },
            {
                "email": "garage@gadisewa.com",
                "hashed_password": hash_password("Test@123"),
                "full_name": "Main Garage Owner",
                "role": "garage",
                "is_active": True,
                "enterprise_id": 1,
            },
            {
                "email": "vendor@gadisewa.com",
                "hashed_password": hash_password("Test@123"),
                "full_name": "Parts Vendor",
                "role": "vendor",
                "is_active": True,
                "enterprise_id": 2,
            },
            {
                "email": "customer@gadisewa.com",
                "hashed_password": hash_password("Test@123"),
                "full_name": "John Doe",
                "role": "customer",
                "is_active": True,
            },
        ]

        for user_data in demo_users:
            exists = db.query(models.User).filter(
                models.User.email == user_data["email"]
            ).first()
            if not exists:
                db.add(models.User(**user_data))
                print(f"[SEED] Created demo user: {user_data['email']}")
        db.commit()
    except Exception as exc:
        db.rollback()
        print(f"[SEED] Warning: could not seed demo users: {exc}")
    finally:
        db.close()


_seed_demo_users()

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
