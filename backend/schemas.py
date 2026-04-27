from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

class User(UserBase):
    id: int
    enterprise_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str = Field(..., max_length=254)
    password: str = Field(..., min_length=1, max_length=128)
    access_token: Optional[str] = Field(None, max_length=500)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Enterprise Schemas
class EnterpriseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: str = Field(..., min_length=1, max_length=50)
    owner: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., max_length=254)
    plan_id: str = Field(..., max_length=100)

class EnterpriseCreate(EnterpriseBase):
    password: Optional[str] = Field(None, min_length=8, max_length=128)

class Enterprise(EnterpriseBase):
    id: int
    status: str
    is_active: bool
    service_interval_days: int
    auto_followup: bool
    created_at: datetime
    class Config:
        orm_mode = True


# Job Schemas
class JobBase(BaseModel):
    customer_id: int
    vehicle_info: str = Field(..., min_length=1, max_length=500)
    complaint: str = Field(..., min_length=1, max_length=2000)
    status: str = Field("Pending", max_length=50)
    labor_cost: float = 0.0

class JobUpdate(BaseModel):
    status: Optional[str] = Field(None, max_length=50)
    labor_cost: Optional[float] = None
    complaint: Optional[str] = Field(None, max_length=2000)

class Job(JobBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

# Inventory Schemas
class InventoryItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    sku: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    vehicle_type: str = Field(..., min_length=1, max_length=100)
    stock: int
    price: float
    unit: str = Field(..., min_length=1, max_length=50)

class InventoryItem(InventoryItemBase):
    id: int
    class Config:
        orm_mode = True

# Transaction Schemas
class TransactionBase(BaseModel):
    type: str = Field(..., min_length=1, max_length=50)  # Income, Expense
    expense_type: Optional[str] = Field(None, max_length=50)  # Fixed, Variable
    amount: float
    category: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=1000)
    enterprise_id: Optional[int] = None

class Transaction(TransactionBase):
    id: str
    timestamp: datetime
    class Config:
        orm_mode = True

class FinancialSummary(BaseModel):
    total_income: float
    total_fixed_expenses: float
    total_variable_expenses: float
    net_profit: float
    transaction_count: int

class VoucherBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=100)
    discount_type: str = Field(..., min_length=1, max_length=50)
    value: float
    min_spend: float = 0.0
    expires_at: datetime

class Voucher(VoucherBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        orm_mode = True

class GlobalItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=100)
    vehicle_type: str = Field(..., min_length=1, max_length=100)
    vehicle_model: Optional[str] = Field(None, max_length=200)
    unit: str = Field("Pcs", max_length=50)

class GlobalItem(GlobalItemBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

# HeldCart Schemas
class HeldCartBase(BaseModel):
    customer_name: Optional[str] = Field(None, max_length=200)
    cart_data: dict
    total: float

class HeldCart(HeldCartBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

# Gamification Schemas
class GadiPointBase(BaseModel):
    user_id: int
    points: int
    action_type: str = Field(..., min_length=1, max_length=50)

class GadiPointCreate(GadiPointBase):
    pass

class GadiPoint(GadiPointBase):
    id: int
    timestamp: datetime
    class Config:
        orm_mode = True

class ReferralBase(BaseModel):
    referral_code: str = Field(..., min_length=1, max_length=50)
    status: str = Field(..., min_length=1, max_length=50)
    reward_claimed: bool

class Referral(ReferralBase):
    id: int
    referrer_id: int
    referred_id: Optional[int]
    created_at: datetime
    class Config:
        orm_mode = True

class Achievement(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=500)
    icon: str = Field(..., min_length=1, max_length=100)
    point_threshold: int
    class Config:
        orm_mode = True

class UserRewardSummary(BaseModel):
    total_points: int
    level: str  # Bronze, Silver, Gold, Platinum
    referral_count: int
    achievements: List[Achievement]

# CRM/Customer Schemas
class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: Optional[str] = Field(None, max_length=254)
    phone: str = Field(..., min_length=1, max_length=20)
    vehicle_history: Optional[dict] = None

class Customer(CustomerBase):
    id: int
    last_service_date: Optional[datetime] = None
    next_service_date: Optional[datetime] = None
    enterprise_id: Optional[int] = None
    class Config:
        orm_mode = True

class CRMSummary(BaseModel):
    total_customers: int
    due_for_service: int
    upcoming_followups: int
    followup_rate: float

class ActivityLogBase(BaseModel):
    user_id: Optional[int] = None
    user_name: str = Field(..., min_length=1, max_length=200)
    action: str = Field(..., min_length=1, max_length=100)
    entity: str = Field(..., min_length=1, max_length=100)
    details: str = Field(..., min_length=1, max_length=2000)

class ActivityLog(ActivityLogBase):
    id: int
    timestamp: datetime
    class Config:
        orm_mode = True

class PlanBase(BaseModel):
    id: str = Field(..., max_length=100)
    name: str = Field(..., min_length=1, max_length=200)
    price: float
    features: List[str]
    duration: str = Field(..., min_length=1, max_length=50)

class Plan(PlanBase):
    class Config:
        orm_mode = True

class AdminStats(BaseModel):
    total_enterprises: int
    active_users: int
    pending_approvals: int
    system_health: str
    mrr: float
    churn_rate: float

class VendorProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    sku: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    price: float
    retail_price: float
    stock: int
    image_url: Optional[str] = Field(None, max_length=1000)
    description: Optional[str] = Field(None, max_length=2000)

class VendorProductCreate(VendorProductBase):
    pass

class VendorProduct(VendorProductBase):
    id: int
    vendor_id: int
    created_at: datetime
    class Config:
        orm_mode = True

class VendorOrderItem(BaseModel):
    product_id: int
    name: str = Field(..., min_length=1, max_length=200)
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
        orm_mode = True

class VendorOrderStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1, max_length=50)

class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)
    target_role: str = Field("all", max_length=50)
    priority: str = Field("info", max_length=50)

class NotificationOut(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime
    class Config:
        orm_mode = True

class PlatformSettingsUpdate(BaseModel):
    trial_period_days: int = 14
    max_users_basic: int = 3
    maintenance_mode: bool = False
    registration_freeze: bool = False

# New Phase 2 Schemas
class StaffMemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=1, max_length=20)
    salary: float = 0.0
    status: str = Field("Present", max_length=50)

class StaffMember(StaffMemberBase):
    id: int
    enterprise_id: int
    created_at: datetime
    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    customer_id: int
    vehicle_info: str = Field(..., min_length=1, max_length=500)
    date: str = Field(..., max_length=50)
    time: str = Field(..., max_length=50)
    service_type: str = Field(..., min_length=1, max_length=200)
    mechanic_name: Optional[str] = Field(None, max_length=200)
    status: str = Field("Confirmed", max_length=50)

class Appointment(AppointmentBase):
    id: int
    enterprise_id: int
    created_at: datetime
    class Config:
        orm_mode = True

class SupportTicketBase(BaseModel):
    subject: str = Field(..., min_length=1, max_length=300)
    message: str = Field(..., min_length=1, max_length=5000)
    priority: str = Field("Normal", max_length=50)

class SupportTicket(SupportTicketBase):
    id: int
    enterprise_id: int
    status: str
    created_at: datetime
    class Config:
        orm_mode = True

class EnterpriseInvoiceBase(BaseModel):
    enterprise_id: int
    invoice_number: str = Field(..., min_length=1, max_length=100)
    amount: float
    status: str = Field("Unpaid", max_length=50)
    due_date: datetime
    billing_month: str = Field(..., min_length=1, max_length=50)

class EnterpriseInvoice(EnterpriseInvoiceBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class PendingEnterpriseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: str = Field(..., min_length=1, max_length=50)  # Garage, Vendor
    owner: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., max_length=254)
    plan_id: str = Field(..., max_length=100)

class PendingEnterprise(PendingEnterpriseBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        orm_mode = True


