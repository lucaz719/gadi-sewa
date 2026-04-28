from database import SessionLocal
import models

db = SessionLocal()
users = db.query(models.User).all()
print(f"{'Email':<30} | {'Role':<10} | {'Hashed Password':<30}")
print("-" * 75)
for u in users:
    print(f"{u.email:<30} | {u.role:<10} | {u.hashed_password:<30}")
db.close()
