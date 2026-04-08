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
import models
import os


def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    """Extract and validate the current user from the Authorization header.

    The app currently issues mock tokens in the format 'mock-jwt-token-{role}'.
    This dependency extracts the token, finds the matching user session,
    and returns the user object.
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

    # With mock tokens ('mock-jwt-token-{role}'), we extract the role.
    # In production this should verify a JWT and look up the user by sub claim.
    if not os.getenv("PRODUCTION") and token.startswith("mock-jwt-token-"):
        role = token.removeprefix("mock-jwt-token-")
        user = db.query(models.User).filter(
            models.User.role == role,
            models.User.is_active == True,
        ).first()
        if user:
            return user

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
