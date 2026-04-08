from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base
import models
from api_routes import (
    jobs, inventory, ai, financials, pos, auth, 
    admin_ops, gamification, ai_assistant, reports, 
    crm_ops, staff, appointment_ops, support_ops, billing_ops, marketplace_ops
)

# Initialize database
models.Base.metadata.create_all(bind=engine)

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
