import sys, os
sys.path.insert(0, '/home/gadisewa/gadisewa_backend')
os.chdir('/home/gadisewa/gadisewa_backend')

from database import SessionLocal
from models import User, Base
from database import engine

print("Creating tables...", flush=True)
Base.metadata.create_all(bind=engine)

db = SessionLocal()
users = db.query(User).all()
print(f"Found {len(users)} users", flush=True)

for u in users:
    print(f"  email={u.email} role={u.role} hash={u.hashed_password}", flush=True)

# Fix admin password hash if needed
admin = db.query(User).filter(User.email == "admin@gadisewa.com").first()
if admin:
    print(f"Admin found, current hash: {admin.hashed_password}", flush=True)
    admin.hashed_password = "hashed_Admin@123"
    db.commit()
    print("Admin password hash updated to: hashed_Admin@123", flush=True)
else:
    print("Admin not found, creating...", flush=True)
    admin = User(
        email="admin@gadisewa.com",
        hashed_password="hashed_Admin@123",
        role="admin",
        full_name="System Admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Admin user created", flush=True)

db.close()
print("Done!", flush=True)
