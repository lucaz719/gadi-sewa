from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from database import SessionLocal
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
import models, schemas
import os
import time
import threading
from collections import defaultdict

router = APIRouter(tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Simple in-memory rate limiter for login attempts
_login_attempts: dict[str, list[float]] = defaultdict(list)
_login_lock = threading.Lock()
_MAX_LOGIN_ATTEMPTS = 5
_LOGIN_WINDOW_SECONDS = 300  # 5 minutes


def _get_client_ip(req: Request) -> str:
    """Return the real client IP, respecting X-Forwarded-For from reverse proxies."""
    forwarded_for = req.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return req.client.host if req.client else "unknown"


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
    """Hash a password using bcrypt. Truncates to 72 bytes as per bcrypt limit."""
    truncated = password[:72]
    return pwd_context.hash(truncated)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash. Truncates password to 72 bytes as per bcrypt limit."""
    # Support legacy fake-hashed passwords during migration
    if hashed_password.startswith("hashed_"):
        return f"hashed_{plain_password}" == hashed_password
    truncated = plain_password[:72]
    return pwd_context.verify(truncated, hashed_password)


def create_access_token(user_id: int, role: str) -> str:
    """Create a signed JWT access token containing the user's ID and role."""
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable must be set")
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


ADMIN_ACCESS_TOKEN = os.getenv("ADMIN_ACCESS_TOKEN")
if not ADMIN_ACCESS_TOKEN:
    raise RuntimeError("ADMIN_ACCESS_TOKEN environment variable must be set")

@router.post("/auth/login", response_model=schemas.Token)
def login(request: schemas.LoginRequest, req: Request, db: Session = Depends(get_db)):
    client_ip = _get_client_ip(req)
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

    access_token = create_access_token(user.id, user.role)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
