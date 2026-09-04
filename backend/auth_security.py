from __future__ import annotations

from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request, Response, status
from jose import JWTError, jwt
import hashlib
import hmac
import os
import secrets

ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-for-local-testing-only")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

ACCESS_COOKIE_NAME = "gadisewa_access_token"
REFRESH_COOKIE_NAME = "gadisewa_refresh_token"
CSRF_COOKIE_NAME = "gadisewa_csrf_token"

COOKIE_SECURE = os.getenv("COOKIE_SECURE", os.getenv("PRODUCTION", "")).lower() in {"1", "true", "yes"}
COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN") or None
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
COOKIE_PATH = os.getenv("COOKIE_PATH", "/")

UNSAFE_HTTP_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(user_id: int, role: str) -> tuple[str, datetime]:
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable must be set")

    expires_at = utc_now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "exp": expires_at}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM), expires_at


def decode_access_token(token: str) -> dict:
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error",
        )

    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


def create_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def create_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def refresh_expires_at() -> datetime:
    return utc_now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)


def set_auth_cookies(
    response: Response,
    *,
    access_token: str,
    refresh_token: str,
    csrf_token: str,
    access_expires_at: datetime,
    refresh_token_expires_at: datetime,
) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        domain=COOKIE_DOMAIN,
        path=COOKIE_PATH,
        expires=access_expires_at,
    )
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        domain=COOKIE_DOMAIN,
        path=COOKIE_PATH,
        expires=refresh_token_expires_at,
    )
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=csrf_token,
        httponly=False,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        domain=COOKIE_DOMAIN,
        path=COOKIE_PATH,
        expires=refresh_token_expires_at,
    )


def clear_auth_cookies(response: Response) -> None:
    for cookie_name, httponly in (
        (ACCESS_COOKIE_NAME, True),
        (REFRESH_COOKIE_NAME, True),
        (CSRF_COOKIE_NAME, False),
    ):
        response.delete_cookie(
            key=cookie_name,
            domain=COOKIE_DOMAIN,
            path=COOKIE_PATH,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            httponly=httponly,
        )


def get_request_token(request: Request) -> tuple[str | None, str | None]:
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.removeprefix("Bearer ").strip()
        if token:
            return token, "bearer"

    cookie_token = request.cookies.get(ACCESS_COOKIE_NAME)
    if cookie_token:
        return cookie_token, "cookie"

    return None, None


def enforce_csrf(request: Request) -> None:
    header_token = request.headers.get("X-CSRF-Token", "")
    cookie_token = request.cookies.get(CSRF_COOKIE_NAME, "")

    if not header_token or not cookie_token or not hmac.compare_digest(header_token, cookie_token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF validation failed",
        )


def require_csrf_for_cookie_auth(request: Request, token_source: str | None) -> None:
    if token_source == "cookie" and request.method.upper() in UNSAFE_HTTP_METHODS:
        enforce_csrf(request)


def build_session_response(user, csrf_token: str, access_expires_at: datetime, refresh_token_expires_at: datetime) -> dict:
    return {
        "user": user,
        "csrf_token": csrf_token,
        "expires_at": access_expires_at,
        "refresh_expires_at": refresh_token_expires_at,
    }


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
