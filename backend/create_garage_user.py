"""
Create / reset the default garage demo user on the live server.
Run from: /home/gadisewa/gadisewa_backend/
  python create_garage_user.py
"""
import sys, os
sys.path.insert(0, '/home/gadisewa/gadisewa_backend')
os.chdir('/home/gadisewa/gadisewa_backend')

from database import engine, SessionLocal, Base
import models

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Import the real hash function used by the auth routes
try:
    from api_routes.auth import hash_password
    print("[OK] Using real hash_password from auth module")
except Exception as e:
    # Fallback: bcrypt direct
    import bcrypt
    def hash_password(pw: str) -> str:
        return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
    print(f"[WARN] Falling back to bcrypt directly: {e}")

USERS_TO_SEED = [
    {
        "email": "garage@gadisewa.com",
        "password": "Test@123",
        "full_name": "Demo Garage Owner",
        "role": "garage",
    },
    {
        "email": "vendor@gadisewa.com",
        "password": "Test@123",
        "full_name": "Demo Vendor",
        "role": "vendor",
    },
    {
        "email": "customer@gadisewa.com",
        "password": "Test@123",
        "full_name": "Demo Customer",
        "role": "customer",
    },
    {
        "email": "admin@gadisewa.com",
        "password": "Admin@123",
        "full_name": "GadiSewa Admin",
        "role": "admin",
    },
]

# Need an enterprise for garage/vendor users
enterprise = db.query(models.Enterprise).first()
if not enterprise:
    enterprise = models.Enterprise(
        name="Demo Garage",
        plan_id="PLAN-PRO",
        is_active=True,
        subscription_status="active"
    )
    db.add(enterprise)
    db.flush()
    print(f"  + Created enterprise: {enterprise.name} (id={enterprise.id})")
else:
    print(f"  = Using existing enterprise: {enterprise.name} (id={enterprise.id})")

for u in USERS_TO_SEED:
    existing = db.query(models.User).filter(models.User.email == u["email"]).first()
    hashed = hash_password(u["password"])
    if existing:
        existing.hashed_password = hashed
        existing.is_active = True
        print(f"  [UPDATED] {u['email']} -> password reset to {u['password']}")
    else:
        new_user = models.User(
            email=u["email"],
            hashed_password=hashed,
            full_name=u["full_name"],
            role=u["role"],
            is_active=True,
            enterprise_id=enterprise.id if u["role"] in ("garage", "vendor") else None
        )
        db.add(new_user)
        print(f"  [CREATED] {u['email']} with role={u['role']}")

db.commit()
db.close()
print("\n[DONE] All demo users are ready.")
print("\nCredentials:")
for u in USERS_TO_SEED:
    print(f"  {u['role']:10s} -> {u['email']}  /  {u['password']}")
