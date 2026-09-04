from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from typing import Dict, List
import models
import os
import schemas
import threading
import time

from auth_security import (
    REFRESH_COOKIE_NAME,
    build_session_response,
    clear_auth_cookies,
    create_access_token,
    create_csrf_token,
    create_refresh_token,
    decode_access_token,
    enforce_csrf,
    get_client_ip,
    get_request_token,
    hash_token,
    refresh_expires_at,
    set_auth_cookies,
    utc_now,
)
from api_routes.dependencies import get_current_user
from database import get_db
from services.admin_service import log_activity

router = APIRouter(tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_ACCESS_TOKEN = os.getenv("ADMIN_ACCESS_TOKEN", "dev-admin-token-12345")

_login_attempts: Dict[str, List[float]] = defaultdict(list)
_login_lock = threading.Lock()
_MAX_LOGIN_ATTEMPTS = 5
_LOGIN_WINDOW_SECONDS = 300


def _check_rate_limit(client_ip: str) -> None:
    now = time.time()
    with _login_lock:
        _login_attempts[client_ip] = [
            attempt for attempt in _login_attempts[client_ip]
            if now - attempt < _LOGIN_WINDOW_SECONDS
        ]
        if len(_login_attempts[client_ip]) >= _MAX_LOGIN_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later.",
            )
        _login_attempts[client_ip].append(now)


def _clear_rate_limit(client_ip: str) -> None:
    with _login_lock:
        _login_attempts.pop(client_ip, None)


def hash_password(password: str) -> str:
    truncated = password[:72]
    return pwd_context.hash(truncated)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if hashed_password.startswith("hashed_"):
        return f"hashed_{plain_password}" == hashed_password
    truncated = plain_password[:72]
    return pwd_context.verify(truncated, hashed_password)


def _revoke_refresh_session(refresh_session: models.RefreshSession | None) -> None:
    if refresh_session and refresh_session.revoked_at is None:
        refresh_session.revoked_at = datetime.utcnow()


def _issue_session(
    response: Response,
    db: Session,
    user: models.User,
    request: Request,
    *,
    prior_session: models.RefreshSession | None = None,
) -> dict:
    csrf_token = create_csrf_token()
    access_token, access_expires_at = create_access_token(user.id, user.role)
    refresh_token = create_refresh_token()
    refresh_token_expires_at = refresh_expires_at()
    refresh_token_hash = hash_token(refresh_token)

    if prior_session is not None:
        prior_session.revoked_at = datetime.utcnow()

    new_session = models.RefreshSession(
        user_id=user.id,
        token_hash=refresh_token_hash,
        expires_at=refresh_token_expires_at,
        last_used_at=datetime.utcnow(),
        created_by_ip=get_client_ip(request),
        user_agent=request.headers.get("User-Agent", "")[:500],
        replaced_by_token_hash=None,
    )
    db.add(new_session)

    if prior_session is not None:
        prior_session.replaced_by_token_hash = refresh_token_hash

    set_auth_cookies(
        response,
        access_token=access_token,
        refresh_token=refresh_token,
        csrf_token=csrf_token,
        access_expires_at=access_expires_at,
        refresh_token_expires_at=refresh_token_expires_at,
    )

    return build_session_response(user, csrf_token, access_expires_at, refresh_token_expires_at)


def _resolve_authenticated_user(request: Request, db: Session) -> models.User | None:
    token, _token_source = get_request_token(request)
    if not token:
        return None

    try:
        payload = decode_access_token(token)
    except HTTPException:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    return db.query(models.User).filter(models.User.id == int(user_id)).first()


@router.post("/auth/login", response_model=schemas.AuthSession)
def login(request: schemas.LoginRequest, req: Request, response: Response, db: Session = Depends(get_db)):
    client_ip = get_client_ip(req)
    _check_rate_limit(client_ip)

    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        log_activity(db, "Login Failed", "Authentication", f"Failed login for {request.email} from {client_ip}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.is_active:
        log_activity(db, "Login Blocked", "Authentication", f"Inactive user login blocked for {user.email}", user_id=user.id, user_name=user.full_name)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    if user.role == "admin" and request.access_token != ADMIN_ACCESS_TOKEN:
        log_activity(db, "Login Failed", "Authentication", f"Invalid admin second factor for {user.email} from {client_ip}", user_id=user.id, user_name=user.full_name)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Valid Admin Access Token required for superadmin login",
        )

    _clear_rate_limit(client_ip)

    active_sessions = db.query(models.RefreshSession).filter(
        models.RefreshSession.user_id == user.id,
        models.RefreshSession.revoked_at.is_(None),
    ).all()
    for active_session in active_sessions:
        active_session.revoked_at = datetime.utcnow()

    payload = _issue_session(response, db, user, req)
    db.commit()
    log_activity(db, "Login Success", "Authentication", f"User logged in from {client_ip}", user_id=user.id, user_name=user.full_name)
    return payload


@router.get("/auth/session", response_model=schemas.AuthSession)
def get_session(request: Request, response: Response, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    csrf_token = create_csrf_token()
    refresh_token_expires_at = utc_now()
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if refresh_token:
        refresh_session = db.query(models.RefreshSession).filter(
            models.RefreshSession.token_hash == hash_token(refresh_token),
            models.RefreshSession.revoked_at.is_(None),
        ).first()
        if refresh_session:
            refresh_token_expires_at = refresh_session.expires_at
        response.set_cookie(key="gadisewa_csrf_token", value=csrf_token, httponly=False)

    access_expires_at = utc_now()
    token, _source = get_request_token(request)
    if token:
        try:
            payload = decode_access_token(token)
            exp = payload.get("exp")
            if isinstance(exp, (int, float)):
                access_expires_at = datetime.fromtimestamp(exp, tz=utc_now().tzinfo)
        except HTTPException:
            pass

    return build_session_response(user, csrf_token, access_expires_at, refresh_token_expires_at)


@router.post("/auth/refresh", response_model=schemas.AuthSession)
def refresh_session(request: Request, response: Response, db: Session = Depends(get_db)):
    enforce_csrf(request)
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_token:
        clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")

    current_session = db.query(models.RefreshSession).filter(
        models.RefreshSession.token_hash == hash_token(refresh_token),
    ).first()
    now = datetime.utcnow()
    if (
        not current_session
        or current_session.revoked_at is not None
        or current_session.expires_at.replace(tzinfo=None) <= now
    ):
        if current_session:
            _revoke_refresh_session(current_session)
            db.commit()
        clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token invalid")

    user = db.query(models.User).filter(
        models.User.id == current_session.user_id,
        models.User.is_active.is_(True),
    ).first()
    if not user:
        _revoke_refresh_session(current_session)
        db.commit()
        clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    payload = _issue_session(response, db, user, request, prior_session=current_session)
    db.commit()
    log_activity(db, "Session Refreshed", "Authentication", f"Session refreshed from {get_client_ip(request)}", user_id=user.id, user_name=user.full_name)
    return payload


@router.post("/auth/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if refresh_token:
        current_session = db.query(models.RefreshSession).filter(
            models.RefreshSession.token_hash == hash_token(refresh_token)
        ).first()
        _revoke_refresh_session(current_session)
        db.commit()

    user = _resolve_authenticated_user(request, db)
    clear_auth_cookies(response)
    if user:
        log_activity(db, "Logout", "Authentication", f"User logged out from {get_client_ip(request)}", user_id=user.id, user_name=user.full_name)
    return {"status": "success"}
