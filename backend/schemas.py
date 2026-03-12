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
