import sys
import os
print("Starting DB check...", flush=True)
sys.path.insert(0, '/home/gadisewa/gadisewa_backend')
os.chdir('/home/gadisewa/gadisewa_backend')

from models import Base, User
from database import engine, SessionLocal
from api_routes.auth import hash_password

print("Creating tables...", flush=True)
Base.metadata.create_all(bind=engine)
print("Tables created.", flush=True)

db = SessionLocal()

# Seed all demo accounts if they are missing
demo_users = [
    {"email": "admin@gadisewa.com", "hashed_password": hash_password("Admin@123"), "role": "admin", "full_name": "System Admin", "is_active": True},
    {"email": "garage@gadisewa.com", "hashed_password": hash_password("Test@123"), "role": "garage", "full_name": "Main Garage Owner", "is_active": True},
    {"email": "vendor@gadisewa.com", "hashed_password": hash_password("Test@123"), "role": "vendor", "full_name": "Parts Vendor", "is_active": True},
    {"email": "customer@gadisewa.com", "hashed_password": hash_password("Test@123"), "role": "customer", "full_name": "John Doe", "is_active": True},
]

for user_data in demo_users:
    existing = db.query(User).filter(User.email == user_data["email"]).first()
    if not existing:
        db.add(User(**user_data))
        print(f"Seeded user: {user_data['email']} ({user_data['role']})", flush=True)
    else:
        print(f"User already exists: {user_data['email']} ({user_data['role']})", flush=True)

db.commit()

# Show all users
users = db.query(User).all()
print(f"\nTotal users: {len(users)}", flush=True)
for u in users:
    print(f"  - {u.email} ({u.role})", flush=True)

db.close()
print("Done.", flush=True)
