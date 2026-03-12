import sys
import os
print("Starting DB check...", flush=True)
sys.path.insert(0, '/home/gadisewa/gadisewa_backend')
os.chdir('/home/gadisewa/gadisewa_backend')

from models import Base
from database import engine, SessionLocal

print("Creating tables...", flush=True)
Base.metadata.create_all(bind=engine)
print("Tables created.", flush=True)

db = SessionLocal()
from models import User
n = db.query(User).count()
print(f"User count: {n}", flush=True)

if n == 0:
    print("Seeding admin user...", flush=True)
    admin = User(
        email="admin@gadisewa.com",
        hashed_password="hashed_Admin@123",
        role="admin",
        full_name="System Admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Admin user seeded.", flush=True)
else:
    # Show existing users
    users = db.query(User).all()
    for u in users:
        print(f"  - {u.email} ({u.role})", flush=True)

db.close()
print("Done.", flush=True)
