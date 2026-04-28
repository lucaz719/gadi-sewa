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

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_name = Column(String) # For display even if user is deleted
    action = Column(String) # Created, Updated, Deleted, Login, etc.
    entity = Column(String) # Job, Inventory, User, etc.
    details = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class PlatformSettings(Base):
    __tablename__ = "platform_settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(String)
    target_role = Column(String, default="all") # all, garage, vendor, admin
    priority = Column(String, default="info") # info, warning, critical
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class StaffMember(Base):
    __tablename__ = "staff_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    phone = Column(String)
    salary = Column(Float, default=0.0)
    status = Column(String, default="Present")
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    vehicle_info = Column(String)
    date = Column(String) # For simplicity in this demo
    time = Column(String)
    service_type = Column(String)
    mechanic_name = Column(String, nullable=True)
    status = Column(String, default="Confirmed")
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id = Column(Integer, primary_key=True, index=True)
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"))
    subject = Column(String)
    message = Column(String)
    status = Column(String, default="Open") # Open, Resolved
    priority = Column(String, default="Normal")
    created_at = Column(DateTime, default=datetime.utcnow)

class EnterpriseInvoice(Base):
    __tablename__ = "enterprise_invoices"
    id = Column(Integer, primary_key=True, index=True)
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"))
    invoice_number = Column(String, unique=True)
    amount = Column(Float)
    status = Column(String, default="Unpaid") # Paid, Unpaid, Overdue
    due_date = Column(DateTime)
    billing_month = Column(String) # e.g. "March 2026"
    created_at = Column(DateTime, default=datetime.utcnow)

class PendingEnterprise(Base):
    __tablename__ = "pending_enterprises"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    owner = Column(String)
    email = Column(String, unique=True)
    plan_id = Column(String)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class VendorProduct(Base):
    __tablename__ = "vendor_products"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("enterprises.id"))
    name = Column(String)
    sku = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    retail_price = Column(Float)
    stock = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VendorOrder(Base):
    __tablename__ = "vendor_orders"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("enterprises.id"))
    garage_id = Column(Integer, ForeignKey("enterprises.id"))
    items = Column(JSON) # List of {product_id, name, qty, price}
    total_amount = Column(Float)
    status = Column(String, default="New") # New, Processing, Shipped, Delivered, Cancelled
    payment_status = Column(String, default="Pending") # Pending, Paid
    created_at = Column(DateTime, default=datetime.utcnow)
