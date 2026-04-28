from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

def seed_marketplace():
    db = SessionLocal()
    try:
        # Get a vendor enterprise (or create one if none exists)
        vendor = db.query(models.Enterprise).filter(models.Enterprise.type == "Vendor").first()
        if not vendor:
            print("No vendor enterprise found to seed products. Please register a vendor first.")
            return

        products = [
            { "name": "Synthetic Engine Oil 5W-30", "sku": "OIL-SYN-530", "category": "Lubricants", "price": 2200, "retail_price": 3200, "stock": 450, "image_url": "https://images.unsplash.com/photo-1635784183209-e8c690e250f2?w=300&h=300&fit=crop" },
            { "name": "Brake Pad Set (Front)", "sku": "BP-FR-001", "category": "Brakes", "price": 1500, "retail_price": 2200, "stock": 120, "image_url": "https://images.unsplash.com/photo-1600161599939-23d16036198c?w=300&h=300&fit=crop" },
            { "name": "Car Battery 12V 45Ah", "sku": "BAT-12V-45", "category": "Batteries", "price": 3800, "retail_price": 5500, "stock": 25, "image_url": "https://images.unsplash.com/photo-1625710772821-48932720118a?w=300&h=300&fit=crop" },
            { "name": "Air Filter (Universal)", "sku": "AF-UNI-99", "category": "Filters", "price": 350, "retail_price": 600, "stock": 8, "image_url": "https://images.unsplash.com/photo-1517059478735-9b73637b6c5e?w=300&h=300&fit=crop" }
        ]

        for p in products:
            existing = db.query(models.VendorProduct).filter(models.VendorProduct.sku == p["sku"]).first()
            if not existing:
                db_p = models.VendorProduct(**p, vendor_id=vendor.id)
                db.add(db_p)
        
        db.commit()
        print("Marketplace seeded successfully.")
    except Exception as e:
        print(f"Error seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_marketplace()
