"""
Authentication and authorization dependencies for route protection.

Usage:
    from api_routes.dependencies import require_role, get_current_user

    @router.get("/admin/users")
    def list_users(user: dict = Depends(require_role("admin"))):
        ...

    @router.get("/jobs")
    def list_jobs(user: dict = Depends(get_current_user)):
        ...
"""
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from jose import JWTError, jwt
import models
import os

ALGORITHM = "HS256"
SECRET_KEY = os.getenv("SECRET_KEY")


def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    """Extract and validate the current user from the Authorization header.

    In non-production environments mock tokens ('mock-jwt-token-{role}') are
    still accepted for backward compatibility with legacy sessions.  In all
    environments a signed JWT (issued by the login endpoint) is the primary
    authentication mechanism.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Support legacy mock tokens in non-production environments only.
    if not os.getenv("PRODUCTION") and token.startswith("mock-jwt-token-"):
        role = token.removeprefix("mock-jwt-token-")
        user = db.query(models.User).filter(
            models.User.role == role,
            models.User.is_active.is_(True),
        ).first()
        if user:
            return user

    # Decode signed JWT.
    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error",
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
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
        return user
    except (JWTError, ValueError) as exc:
        import logging
        logging.debug("Token decode failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_role(*allowed_roles: str):
    """Return a dependency that enforces role-based access.

    Args:
        *allowed_roles: One or more role strings that are permitted.

    Example:
        @router.get("/admin/users")
        def list_users(user = Depends(require_role("admin"))):
            ...
    """
    def _dependency(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {', '.join(allowed_roles)}",
            )
        return user
    return _dependency
