from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String)  # admin, garage, vendor, customer
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Enterprise(Base):
    __tablename__ = "enterprises"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String) # Garage, Vendor
    owner = Column(String)
    email = Column(String)
    plan_id = Column(String, ForeignKey("plans.id"))
    status = Column(String, default="Active")
    is_active = Column(Boolean, default=True)
    service_interval_days = Column(Integer, default=90)
    auto_followup = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Plan(Base):
    __tablename__ = "plans"
    id = Column(String, primary_key=True)
    name = Column(String)
    price = Column(Float)
    features = Column(JSON)
    duration = Column(String)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    vehicle_info = Column(String) # Make, Model, Plate
    complaint = Column(String)
    status = Column(String, default="Pending")
    labor_cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    vehicle_history = Column(JSON)
    last_service_date = Column(DateTime, nullable=True)
    next_service_date = Column(DateTime, nullable=True)
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"), nullable=True)

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sku = Column(String, unique=True, index=True)
    category = Column(String)
    vehicle_type = Column(String) # Car, Motorbike, Truck
    stock = Column(Integer, default=0)
    price = Column(Float, default=0.0)
    unit = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True)
    type = Column(String) # Income, Expense
    expense_type = Column(String, nullable=True) # Fixed, Variable (only for Expense)
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Voucher(Base):
    __tablename__ = "vouchers"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    discount_type = Column(String) # Percentage, Fixed
    value = Column(Float)
    min_spend = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class GlobalItem(Base):
    __tablename__ = "global_catalog"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    vehicle_type = Column(String) # Car, Motorbike, Truck
    vehicle_model = Column(String, nullable=True)
    unit = Column(String, default="Pcs")
    created_at = Column(DateTime, default=datetime.utcnow)

class HeldCart(Base):
    __tablename__ = "held_carts"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=True)
    cart_data = Column(JSON)  # Store cart items as JSON
    total = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class GadiPoint(Base):
    __tablename__ = "gadi_points"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    points = Column(Integer, default=0)
    action_type = Column(String) # Service, Purchase, Referral
    timestamp = Column(DateTime, default=datetime.utcnow)

class Referral(Base):
    __tablename__ = "referrals"
    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id"))
    referred_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    referral_code = Column(String, unique=True, index=True)
    status = Column(String, default="Pending") # Pending, Completed
    reward_claimed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    icon = Column(String) # Material icon name
    point_threshold = Column(Integer, default=0)

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)
