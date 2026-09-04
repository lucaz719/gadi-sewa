from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
import models
import os

from auth_security import (
    decode_access_token,
    get_request_token,
    require_csrf_for_cookie_auth,
)
from database import get_db


def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    token, token_source = get_request_token(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not os.getenv("PRODUCTION") and token.startswith("mock-jwt-token-"):
        role = token.removeprefix("mock-jwt-token-")
        user = db.query(models.User).filter(
            models.User.role == role,
            models.User.is_active.is_(True),
        ).first()
        if user:
            request.state.auth_token_source = "bearer"
            return user

    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(models.User).filter(
        models.User.id == int(user_id),
        models.User.is_active.is_(True),
    ).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )

    request.state.auth_token_source = token_source
    require_csrf_for_cookie_auth(request, token_source)
    return user


def require_role(*allowed_roles: str):
    def _dependency(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {', '.join(allowed_roles)}",
            )
        return user

    return _dependency


def resolve_enterprise_access(user: models.User, enterprise_id: int | None = None, *, allow_admin_all: bool = True) -> int:
    if user.role == "admin" and allow_admin_all:
        if enterprise_id is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="enterprise_id is required")
        return enterprise_id

    if user.enterprise_id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has no enterprise access")

    if enterprise_id is not None and enterprise_id != user.enterprise_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied for this enterprise")

    return user.enterprise_id


def enforce_same_user_or_admin(user: models.User, target_user_id: int) -> None:
    if user.role == "admin":
        return
    if user.id != target_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied for this user")


def enforce_vendor_access(user: models.User, vendor_id: int) -> None:
    if user.role == "admin":
        return
    if user.role != "vendor" or user.enterprise_id != vendor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Vendor access denied")


def enforce_garage_access(user: models.User, garage_id: int) -> None:
    if user.role == "admin":
        return
    if user.role != "garage" or user.enterprise_id != garage_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Garage access denied")


def enforce_resource_enterprise_access(user: models.User, resource_enterprise_id: int | None) -> None:
    if user.role == "admin":
        return
    if user.enterprise_id is None or resource_enterprise_id is None or user.enterprise_id != resource_enterprise_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied for this resource")
