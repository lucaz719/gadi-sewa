from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
import os

router = APIRouter(tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In a real app, use passlib for hashing. For this demo, we use a prefix.
def verify_password(plain_password, hashed_password):
    return f"hashed_{plain_password}" == hashed_password

ADMIN_ACCESS_TOKEN = os.getenv("ADMIN_ACCESS_TOKEN", "GS-ADMIN-2026")

@router.post("/auth/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials")
    
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    
    # Special check for admin role
    if user.role == "admin":
        if not request.access_token or request.access_token != ADMIN_ACCESS_TOKEN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Valid Admin Access Token required for superadmin login"
            )

    # Return a simple mock token for now
    return {
        "access_token": f"mock-jwt-token-{user.role}",
        "token_type": "bearer",
        "user": user
    }
