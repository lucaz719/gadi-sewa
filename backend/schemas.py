from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    enterprise_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str
    access_token: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Enterprise Schemas
class EnterpriseBase(BaseModel):
    name: str
    type: str
    owner: str
    email: str
    plan_id: str

class EnterpriseCreate(EnterpriseBase):
    password: Optional[str] = None  # If None, auto-generate from email

class Enterprise(EnterpriseBase):
    id: int
    status: str
    is_active: bool
    service_interval_days: int
    auto_followup: bool
    created_at: datetime
    class Config:
        from_attributes = True


# Job Schemas
class JobBase(BaseModel):
    customer_id: int
    vehicle_info: str
    complaint: str
    status: str = "Pending"
    labor_cost: float = 0.0

class JobUpdate(BaseModel):
    status: Optional[str] = None
    labor_cost: Optional[float] = None
    complaint: Optional[str] = None

class Job(JobBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Inventory Schemas
class InventoryItemBase(BaseModel):
    name: str
    sku: str
    category: str
    vehicle_type: str
    stock: int
    price: float
    unit: str

class InventoryItem(InventoryItemBase):
    id: int
    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    type: str # Income, Expense
    expense_type: Optional[str] = None # Fixed, Variable
    amount: float
    category: str
    description: str
    enterprise_id: Optional[int] = None

class Transaction(TransactionBase):
    id: str
    timestamp: datetime
    class Config:
        from_attributes = True

class FinancialSummary(BaseModel):
    total_income: float
    total_fixed_expenses: float
    total_variable_expenses: float
    net_profit: float
    transaction_count: int

class VoucherBase(BaseModel):
    code: str
    discount_type: str
    value: float
    min_spend: float = 0.0
    expires_at: datetime

class Voucher(VoucherBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class GlobalItemBase(BaseModel):
    name: str
    category: str
    vehicle_type: str
    vehicle_model: Optional[str] = None
    unit: str = "Pcs"

class GlobalItem(GlobalItemBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# HeldCart Schemas
class HeldCartBase(BaseModel):
    customer_name: Optional[str] = None
    cart_data: dict
    total: float

class HeldCart(HeldCartBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Gamification Schemas
class GadiPointBase(BaseModel):
    user_id: int
    points: int
    action_type: str

class GadiPointCreate(GadiPointBase):
    pass

class GadiPoint(GadiPointBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class ReferralBase(BaseModel):
    referral_code: str
    status: str
    reward_claimed: bool

class Referral(ReferralBase):
    id: int
    referrer_id: int
    referred_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

class Achievement(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    point_threshold: int
    class Config:
        from_attributes = True

class UserRewardSummary(BaseModel):
    total_points: int
    level: str # Bronze, Silver, Gold, Platinum
    referral_count: int
    achievements: List[Achievement]

# CRM/Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str
    vehicle_history: Optional[dict] = None

class Customer(CustomerBase):
    id: int
    last_service_date: Optional[datetime] = None
    next_service_date: Optional[datetime] = None
    enterprise_id: Optional[int] = None
    class Config:
        from_attributes = True

class CRMSummary(BaseModel):
    total_customers: int
    due_for_service: int
    upcoming_followups: int
    followup_rate: float

class ActivityLogBase(BaseModel):
    user_id: Optional[int] = None
    user_name: str
    action: str
    entity: str
    details: str

class ActivityLog(ActivityLogBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class PlanBase(BaseModel):
    id: str
    name: str
    price: float
    features: List[str]
    duration: str

class Plan(PlanBase):
    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_enterprises: int
    active_users: int
    pending_approvals: int
    system_health: str
    mrr: float
    churn_rate: float

class VendorProductBase(BaseModel):
    name: str
    sku: str
    category: str
    price: float
    retail_price: float
    stock: int
    image_url: Optional[str] = None
    description: Optional[str] = None

class VendorProductCreate(VendorProductBase):
    pass

class VendorProduct(VendorProductBase):
    id: int
    vendor_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class VendorOrderItem(BaseModel):
    product_id: int
    name: str
    qty: int
    price: float

class VendorOrderCreate(BaseModel):
    vendor_id: int
    items: List[VendorOrderItem]
    total_amount: float

class VendorOrder(BaseModel):
    id: int
    vendor_id: int
    garage_id: int
    items: List[VendorOrderItem]
    total_amount: float
    status: str
    payment_status: str
    created_at: datetime
    class Config:
        from_attributes = True

class VendorOrderStatusUpdate(BaseModel):
    status: str

class NotificationBase(BaseModel):
    title: str
    message: str
    target_role: str = "all"
    priority: str = "info"

class NotificationOut(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

class PlatformSettingsUpdate(BaseModel):
    trial_period_days: int = 14
    max_users_basic: int = 3
    maintenance_mode: bool = False
    registration_freeze: bool = False

# New Phase 2 Schemas
class StaffMemberBase(BaseModel):
    name: str
    role: str
    phone: str
    salary: float = 0.0
    status: str = "Present"

class StaffMember(StaffMemberBase):
    id: int
    enterprise_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    customer_id: int
    vehicle_info: str
    date: str
    time: str
    service_type: str
    mechanic_name: Optional[str] = None
    status: str = "Confirmed"

class Appointment(AppointmentBase):
    id: int
    enterprise_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SupportTicketBase(BaseModel):
    subject: str
    message: str
    priority: str = "Normal"

class SupportTicket(SupportTicketBase):
    id: int
    enterprise_id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class EnterpriseInvoiceBase(BaseModel):
    enterprise_id: int
    invoice_number: str
    amount: float
    status: str = "Unpaid"
    due_date: datetime
    billing_month: str

class EnterpriseInvoice(EnterpriseInvoiceBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class PendingEnterpriseBase(BaseModel):
    name: str
    type: str # Garage, Vendor
    owner: str
    email: str
    plan_id: str

class PendingEnterprise(PendingEnterpriseBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

