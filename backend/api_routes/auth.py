from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from database import SessionLocal
from passlib.context import CryptContext
import models, schemas
import os
import time
import threading
from collections import defaultdict

router = APIRouter(tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simple in-memory rate limiter for login attempts
_login_attempts: dict[str, list[float]] = defaultdict(list)
_login_lock = threading.Lock()
_MAX_LOGIN_ATTEMPTS = 5
_LOGIN_WINDOW_SECONDS = 300  # 5 minutes


def _check_rate_limit(client_ip: str) -> None:
    """Raise 429 if the client has exceeded login attempt limits."""
    now = time.time()
    with _login_lock:
        # Prune old entries
        _login_attempts[client_ip] = [
            t for t in _login_attempts[client_ip]
            if now - t < _LOGIN_WINDOW_SECONDS
        ]
        if len(_login_attempts[client_ip]) >= _MAX_LOGIN_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later.",
            )
        _login_attempts[client_ip].append(now)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash. Supports legacy hashed_ prefix for migration."""
    # Support legacy fake-hashed passwords during migration
    if hashed_password.startswith("hashed_"):
        return f"hashed_{plain_password}" == hashed_password
    return pwd_context.verify(plain_password, hashed_password)


ADMIN_ACCESS_TOKEN = os.getenv("ADMIN_ACCESS_TOKEN")
if not ADMIN_ACCESS_TOKEN:
    raise RuntimeError("ADMIN_ACCESS_TOKEN environment variable must be set")

@router.post("/auth/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, req: Request, db: Session = Depends(get_db)):
    client_ip = req.client.host if req.client else "unknown"
    _check_rate_limit(client_ip)

    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
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
