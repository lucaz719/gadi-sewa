from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from database import get_db
from datetime import datetime, timedelta
import models
import os
import json

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

# --- Gemini Integration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
_genai = None

def _get_genai():
    global _genai
    if _genai is None and GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            _genai = genai
        except Exception:
            pass
    return _genai


# --- Request / Response Schemas ---

class ChatRequest(BaseModel):
    message: str
    user_role: str
    current_path: str

class ActionPayload(BaseModel):
    type: str  # "navigate", "create_job", "book_appointment", "check_inventory", "financial_summary", "info"
    data: Optional[Dict[str, Any]] = None
    label: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str]
    action: Optional[str] = None  # legacy navigate support: "navigate:/path"
    actions: Optional[List[ActionPayload]] = None  # rich action cards
    context_data: Optional[Dict[str, Any]] = None  # data payload for frontend display

class AiActionRequest(BaseModel):
    action: str  # "create_job", "book_appointment", "search_inventory", "financial_summary", "service_reminder", "diagnose"
    params: Dict[str, Any] = {}
    user_role: str = "garage"

class AiActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    follow_up: Optional[List[str]] = None


# --- Helpers to gather context from DB ---

def _get_business_snapshot(db: Session, enterprise_id: int = 1) -> dict:
    """Gather a quick snapshot of current business state for AI context."""
    jobs_total = db.query(func.count(models.Job.id)).scalar() or 0
    jobs_pending = db.query(func.count(models.Job.id)).filter(models.Job.status == "Pending").scalar() or 0
    jobs_in_progress = db.query(func.count(models.Job.id)).filter(models.Job.status == "In Progress").scalar() or 0
    jobs_completed = db.query(func.count(models.Job.id)).filter(models.Job.status == "Completed").scalar() or 0

    inventory_items = db.query(func.count(models.InventoryItem.id)).scalar() or 0
    low_stock = db.query(func.count(models.InventoryItem.id)).filter(models.InventoryItem.stock <= 5).scalar() or 0

    customers_total = db.query(func.count(models.Customer.id)).scalar() or 0

    # Financial snapshot
    transactions = db.query(models.Transaction).all()
    total_income = sum(t.amount for t in transactions if t.type == "Income")
    total_expense = sum(t.amount for t in transactions if t.type == "Expense")

    # Overdue follow-ups
    now = datetime.utcnow()
    overdue_customers = db.query(func.count(models.Customer.id)).filter(
        models.Customer.next_service_date != None,
        models.Customer.next_service_date < now
    ).scalar() or 0

    return {
        "jobs": {"total": jobs_total, "pending": jobs_pending, "in_progress": jobs_in_progress, "completed": jobs_completed},
        "inventory": {"total_items": inventory_items, "low_stock_count": low_stock},
        "customers": {"total": customers_total, "overdue_followups": overdue_customers},
        "financials": {"total_income": total_income, "total_expense": total_expense, "net_profit": total_income - total_expense}
    }


def _build_system_prompt(user_role: str, current_path: str, snapshot: dict) -> str:
    """Build a rich system prompt for Gemini with full business context."""
    return f"""You are GadiSewa AI Assistant — an intelligent in-app helper for a Nepali garage/vehicle service management platform.

Current user role: {user_role}
Current page: {current_path}

LIVE BUSINESS DATA:
- Jobs: {snapshot['jobs']['total']} total, {snapshot['jobs']['pending']} pending, {snapshot['jobs']['in_progress']} in progress, {snapshot['jobs']['completed']} completed
- Inventory: {snapshot['inventory']['total_items']} items, {snapshot['inventory']['low_stock_count']} items low on stock
- Customers: {snapshot['customers']['total']} total, {snapshot['customers']['overdue_followups']} overdue for service
- Financials: NPR {snapshot['financials']['total_income']:.0f} income, NPR {snapshot['financials']['total_expense']:.0f} expenses, NPR {snapshot['financials']['net_profit']:.0f} net profit

INSTRUCTIONS:
1. Be concise, friendly, and helpful. Use Nepali cultural context (greet with "Namaste", use NPR for currency).
2. When the user wants to PERFORM an action (create a job, book appointment, check inventory, etc.), respond with the action in your JSON.
3. You can suggest navigation to specific pages.
4. Give proactive business advice based on the live data above.
5. Always respond in valid JSON with these fields:
   - "reply": your text response
   - "suggestions": array of 2-4 quick follow-up suggestion strings
   - "navigate": optional path to navigate to (e.g. "/jobs/new")
   - "action_type": optional action to execute — one of: "create_job", "book_appointment", "search_inventory", "financial_summary", "service_reminder", "diagnose", or null
   - "action_data": optional object with parameters for the action

ROLE-SPECIFIC GUIDANCE:
- garage: Can manage jobs, inventory, staff, financials, customers, appointments
- customer: Can book services, check vehicle history, log fuel, view offers, emergency SOS
- vendor: Can manage products, orders, network, financials
- admin: Can manage enterprises, users, plans, vouchers, revenue"""


# --- Smart Chat Endpoint (Gemini-powered with fallback) ---

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    snapshot = _get_business_snapshot(db)
    genai = _get_genai()

    # Try Gemini-powered response first
    if genai:
        try:
            system_prompt = _build_system_prompt(req.user_role, req.current_path, snapshot)
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(
                f"{system_prompt}\n\nUser message: {req.message}\n\nRespond ONLY with valid JSON."
            )

            # Parse the AI response
            raw_text = response.text.strip()
            # Strip markdown code fence if present
            if raw_text.startswith("```"):
                lines = raw_text.split("\n")
                lines = [l for l in lines if not l.strip().startswith("```")]
                raw_text = "\n".join(lines)

            ai_data = json.loads(raw_text)

            reply = ai_data.get("reply", "I'm here to help!")
            suggestions = ai_data.get("suggestions", ["Show dashboard", "Create a job"])
            navigate = ai_data.get("navigate")
            action_type = ai_data.get("action_type")
            action_data = ai_data.get("action_data", {})

            actions = []
            if action_type:
                actions.append(ActionPayload(
                    type=action_type,
                    data=action_data,
                    label=f"Execute: {action_type.replace('_', ' ').title()}"
                ))

            return ChatResponse(
                reply=reply,
                suggestions=suggestions,
                action=f"navigate:{navigate}" if navigate else None,
                actions=actions if actions else None,
                context_data=snapshot
            )
        except Exception:
            pass  # Fall through to smart rule-based fallback

    # --- Smart rule-based fallback (enhanced) ---
    return _rule_based_chat(req, snapshot, db)


def _rule_based_chat(req: ChatRequest, snapshot: dict, db: Session) -> ChatResponse:
    """Enhanced keyword-based chat with real data integration and action support."""
    msg = req.message.lower().strip()
    actions: List[ActionPayload] = []

    # --- Job-related ---
    if any(kw in msg for kw in ["create job", "new job", "open job", "start job"]):
        actions.append(ActionPayload(type="create_job", label="Create New Job", data={}))
        return ChatResponse(
            reply=f"Let's create a new job card! You currently have {snapshot['jobs']['pending']} pending jobs. I'll take you to the job creation page.",
            suggestions=["Go to Job Board", "Show pending jobs", "AI diagnose issue"],
            action="navigate:/jobs/new",
            actions=actions
        )

    if any(kw in msg for kw in ["job", "work", "pending", "jobs status"]):
        return ChatResponse(
            reply=f"Here's your job overview: {snapshot['jobs']['pending']} pending, {snapshot['jobs']['in_progress']} in progress, {snapshot['jobs']['completed']} completed ({snapshot['jobs']['total']} total).",
            suggestions=["Create new job", "Go to Job Board", "View completed jobs"],
            action="navigate:/jobs",
            context_data={"jobs": snapshot["jobs"]}
        )

    # --- Inventory ---
    if any(kw in msg for kw in ["inventory", "stock", "parts", "low stock"]):
        low_items = db.query(models.InventoryItem).filter(models.InventoryItem.stock <= 5).all()
        low_names = [f"{item.name} ({item.stock} left)" for item in low_items[:5]]

        if low_items:
            reply = f"⚠️ You have {len(low_items)} low-stock items: {', '.join(low_names)}. Consider reordering!"
        else:
            reply = f"Your inventory is healthy with {snapshot['inventory']['total_items']} items. No critical shortages."

        actions.append(ActionPayload(type="search_inventory", label="Search Inventory", data={}))
        return ChatResponse(
            reply=reply,
            suggestions=["Go to Inventory", "Order from marketplace", "Add new item"],
            action="navigate:/inventory",
            actions=actions,
            context_data={"inventory": snapshot["inventory"], "low_stock_items": low_names}
        )

    # --- Financial ---
    if any(kw in msg for kw in ["financial", "money", "profit", "income", "expense", "revenue", "earning"]):
        fin = snapshot["financials"]
        actions.append(ActionPayload(type="financial_summary", label="View Full Report", data={}))
        return ChatResponse(
            reply=f"💰 Financial Snapshot: NPR {fin['total_income']:,.0f} income, NPR {fin['total_expense']:,.0f} expenses. Net profit: NPR {fin['net_profit']:,.0f}.",
            suggestions=["View Reports", "Log expense", "Cash Flow", "Download report"],
            action="navigate:/financials",
            actions=actions,
            context_data={"financials": fin}
        )

    # --- Customer / CRM ---
    if any(kw in msg for kw in ["customer", "follow up", "followup", "reminder", "overdue", "service due"]):
        overdue = snapshot["customers"]["overdue_followups"]
        if overdue > 0:
            reply = f"📋 You have {overdue} customers overdue for service. Sending reminders can increase retention by 30%!"
        else:
            reply = f"All {snapshot['customers']['total']} customers are up to date! Great job maintaining your service schedule."
        actions.append(ActionPayload(type="service_reminder", label="Send Reminders", data={}))
        return ChatResponse(
            reply=reply,
            suggestions=["View Customers", "Send reminders", "CRM Settings"],
            action="navigate:/customers",
            actions=actions,
            context_data={"customers": snapshot["customers"]}
        )

    # --- Booking (customer role) ---
    if any(kw in msg for kw in ["book", "appointment", "schedule", "service"]):
        if req.user_role == "customer":
            actions.append(ActionPayload(type="book_appointment", label="Book Now", data={}))
            return ChatResponse(
                reply="Let's book a service for your vehicle! Choose your vehicle and preferred garage.",
                suggestions=["Quick booking", "View service history", "Compare garages"],
                action="navigate:/portal/book",
                actions=actions
            )
        else:
            return ChatResponse(
                reply="Appointment management: Check your calendar for upcoming bookings or create a new one.",
                suggestions=["View Appointments", "Create Appointment", "Today's Schedule"],
                action="navigate:/appointments"
            )

    # --- AI Diagnosis ---
    if any(kw in msg for kw in ["diagnose", "analyze", "what's wrong", "issue", "problem", "noise", "vibrat", "leak"]):
        actions.append(ActionPayload(type="diagnose", label="Start AI Diagnosis", data={"complaint": msg}))
        return ChatResponse(
            reply="I can help diagnose the vehicle issue! Let me analyze the symptoms. Describe the issue in detail or go to Create Job to use our AI diagnostics.",
            suggestions=["Create job with AI", "Common issues", "Parts lookup"],
            action="navigate:/jobs/new",
            actions=actions
        )

    # --- Rewards / Points ---
    if any(kw in msg for kw in ["points", "reward", "gadipoint", "loyalty"]):
        return ChatResponse(
            reply="GadiPoints are earned for every service (50 pts), referral (500 pts), and purchase. Redeem them in the Rewards Hub for discounts!",
            suggestions=["Open Rewards Hub", "Generate Referral Code", "How to earn more?"],
            action="navigate:/portal/offers"
        )

    # --- Referral ---
    if "refer" in msg:
        return ChatResponse(
            reply="Share your unique referral code to earn 500 GadiPoints per referral! Your friends also get a welcome bonus.",
            suggestions=["Generate Referral Code", "See my referrals", "Rewards Hub"],
            action="navigate:/portal/offers"
        )

    # --- Emergency ---
    if any(kw in msg for kw in ["emergency", "sos", "help", "breakdown", "accident", "tow"]):
        if req.user_role == "customer":
            return ChatResponse(
                reply="🚨 Emergency mode! Tap the SOS button to find the nearest mechanic instantly. Stay safe!",
                suggestions=["Go to Emergency SOS", "Call roadside help"],
                action="navigate:/portal/sos"
            )

    # --- Dashboard / Summary ---
    if any(kw in msg for kw in ["dashboard", "summary", "overview", "how's business", "today", "status"]):
        j = snapshot["jobs"]
        c = snapshot["customers"]
        f = snapshot["financials"]
        reply = (
            f"📊 Business Summary:\n"
            f"• Jobs: {j['pending']} pending, {j['in_progress']} in progress\n"
            f"• Customers: {c['total']} total, {c['overdue_followups']} need follow-up\n"
            f"• Revenue: NPR {f['net_profit']:,.0f} net profit"
        )
        return ChatResponse(
            reply=reply,
            suggestions=["View Dashboard", "Create job", "Check inventory", "Financial details"],
            action="navigate:/",
            context_data=snapshot
        )

    # --- Marketplace ---
    if any(kw in msg for kw in ["marketplace", "order parts", "buy parts", "supplier", "vendor"]):
        return ChatResponse(
            reply="Browse the GadiSewa Marketplace to order genuine parts from verified vendors with competitive pricing.",
            suggestions=["Open Marketplace", "My Orders", "Compare Vendors"],
            action="navigate:/marketplace"
        )

    # --- Catch-all with proactive advice ---
    proactive_tips = []
    if snapshot["jobs"]["pending"] > 3:
        proactive_tips.append(f"You have {snapshot['jobs']['pending']} pending jobs — consider prioritizing them.")
    if snapshot["inventory"]["low_stock_count"] > 0:
        proactive_tips.append(f"{snapshot['inventory']['low_stock_count']} inventory items are low on stock.")
    if snapshot["customers"]["overdue_followups"] > 0:
        proactive_tips.append(f"{snapshot['customers']['overdue_followups']} customers are overdue for service follow-up.")

    tip_text = " Also: " + " ".join(proactive_tips) if proactive_tips else ""

    return ChatResponse(
        reply=f"Namaste! I'm your GadiSewa AI Assistant. I can help you manage jobs, check inventory, track finances, book services, and more.{tip_text}",
        suggestions=["Business summary", "Create a job", "Check inventory", "Financial report"],
        context_data=snapshot
    )


# --- AI Action Execution Endpoint ---

@router.post("/execute-action", response_model=AiActionResponse)
def execute_ai_action(req: AiActionRequest, db: Session = Depends(get_db)):
    """Execute an in-app action triggered by the AI assistant."""

    if req.action == "create_job":
        return _action_create_job(req.params, db)
    elif req.action == "search_inventory":
        return _action_search_inventory(req.params, db)
    elif req.action == "financial_summary":
        return _action_financial_summary(req.params, db)
    elif req.action == "service_reminder":
        return _action_service_reminders(req.params, db)
    elif req.action == "diagnose":
        return _action_diagnose(req.params)
    elif req.action == "book_appointment":
        return _action_book_appointment(req.params, db)
    elif req.action == "daily_digest":
        return _action_daily_digest(db)
    elif req.action == "smart_reorder":
        return _action_smart_reorder(db)
    else:
        return AiActionResponse(
            success=False,
            message=f"Unknown action: {req.action}",
            follow_up=["Try: create_job, search_inventory, financial_summary, service_reminder, diagnose"]
        )


def _action_create_job(params: dict, db: Session) -> AiActionResponse:
    """Create a job card via AI."""
    customer_id = params.get("customer_id", 1)
    vehicle_info = params.get("vehicle_info", "General Service")
    complaint = params.get("complaint", "AI-generated job card")

    job = models.Job(
        customer_id=customer_id,
        vehicle_info=vehicle_info,
        complaint=complaint,
        status="Pending",
        labor_cost=0.0
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    return AiActionResponse(
        success=True,
        message=f"Job #{job.id} created successfully for vehicle: {vehicle_info}",
        data={"job_id": job.id, "status": "Pending"},
        follow_up=["View job board", "Add parts to job", "Assign mechanic"]
    )


def _action_search_inventory(params: dict, db: Session) -> AiActionResponse:
    """Search inventory items."""
    query_str = params.get("query", "").lower()

    items = db.query(models.InventoryItem).all()
    if query_str:
        items = [i for i in items if query_str in i.name.lower() or query_str in (i.category or "").lower()]

    results = [
        {"id": i.id, "name": i.name, "stock": i.stock, "price": i.price, "category": i.category}
        for i in items[:10]
    ]

    return AiActionResponse(
        success=True,
        message=f"Found {len(results)} items" + (f" matching '{query_str}'" if query_str else ""),
        data={"items": results, "total": len(items)},
        follow_up=["Filter by category", "Add new item", "Order from marketplace"]
    )


def _action_financial_summary(params: dict, db: Session) -> AiActionResponse:
    """Get AI-enhanced financial summary."""
    transactions = db.query(models.Transaction).all()
    total_income = sum(t.amount for t in transactions if t.type == "Income")
    total_fixed = sum(t.amount for t in transactions if t.type == "Expense" and t.expense_type == "Fixed")
    total_variable = sum(t.amount for t in transactions if t.type == "Expense" and t.expense_type == "Variable")
    total_expense = total_fixed + total_variable
    net_profit = total_income - total_expense

    # Generate AI insight
    if net_profit > 0:
        insight = f"Your business is profitable with NPR {net_profit:,.0f} net profit. Fixed costs are NPR {total_fixed:,.0f} and variable costs NPR {total_variable:,.0f}."
    elif total_income == 0 and total_expense == 0:
        insight = "No financial data recorded yet. Start logging transactions to get AI-powered insights."
    else:
        insight = f"Warning: Your expenses (NPR {total_expense:,.0f}) exceed income (NPR {total_income:,.0f}). Consider reviewing variable costs."

    return AiActionResponse(
        success=True,
        message=insight,
        data={
            "total_income": total_income,
            "total_expense": total_expense,
            "total_fixed": total_fixed,
            "total_variable": total_variable,
            "net_profit": net_profit,
            "transaction_count": len(transactions)
        },
        follow_up=["View detailed reports", "Log new transaction", "Cash flow analysis"]
    )


def _action_service_reminders(params: dict, db: Session) -> AiActionResponse:
    """Get customers who are overdue or due soon for service."""
    now = datetime.utcnow()
    soon = now + timedelta(days=7)

    overdue = db.query(models.Customer).filter(
        models.Customer.next_service_date != None,
        models.Customer.next_service_date < now
    ).all()

    upcoming = db.query(models.Customer).filter(
        models.Customer.next_service_date != None,
        models.Customer.next_service_date >= now,
        models.Customer.next_service_date <= soon
    ).all()

    overdue_list = [{"id": c.id, "name": c.name, "phone": c.phone, "due_date": str(c.next_service_date)} for c in overdue]
    upcoming_list = [{"id": c.id, "name": c.name, "phone": c.phone, "due_date": str(c.next_service_date)} for c in upcoming]

    msg = f"📋 Service Reminders: {len(overdue)} overdue, {len(upcoming)} due within 7 days."
    if not overdue and not upcoming:
        msg = "All customers are up to date with their service schedules!"

    return AiActionResponse(
        success=True,
        message=msg,
        data={"overdue": overdue_list, "upcoming": upcoming_list},
        follow_up=["Send SMS reminders", "View all customers", "Update CRM settings"]
    )


def _action_diagnose(params: dict) -> AiActionResponse:
    """AI-powered vehicle diagnosis."""
    complaint = params.get("complaint", "")
    vehicle = params.get("vehicle_info", "Unknown vehicle")

    genai = _get_genai()
    if genai and complaint:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"""Diagnose this vehicle issue for a Nepali garage.
Vehicle: {vehicle}
Complaint: {complaint}

Respond in JSON with:
- "possible_causes": array of strings (2-4 causes)
- "recommended_steps": array of strings (2-4 steps)
- "estimated_hours": number
- "parts_needed": array of strings
- "urgency": "low" | "medium" | "high"
"""
            response = model.generate_content(prompt)
            raw = response.text.strip()
            if raw.startswith("```"):
                lines = raw.split("\n")
                lines = [l for l in lines if not l.strip().startswith("```")]
                raw = "\n".join(lines)
            diagnosis = json.loads(raw)

            return AiActionResponse(
                success=True,
                message=f"Diagnosis complete for: {complaint[:60]}",
                data=diagnosis,
                follow_up=["Create job with diagnosis", "Check parts availability", "Get price estimate"]
            )
        except Exception:
            pass

    # Fallback diagnosis
    return AiActionResponse(
        success=True,
        message="Basic diagnosis generated. For detailed AI analysis, describe the issue in Create Job.",
        data={
            "possible_causes": ["Requires physical inspection"],
            "recommended_steps": ["Bring vehicle for inspection", "Run diagnostic scan"],
            "estimated_hours": 1,
            "parts_needed": ["To be determined after inspection"],
            "urgency": "medium"
        },
        follow_up=["Create job card", "Book inspection appointment"]
    )


def _action_book_appointment(params: dict, db: Session) -> AiActionResponse:
    """Book a service appointment via AI."""
    customer_id = params.get("customer_id", 1)
    vehicle_info = params.get("vehicle_info", "General Vehicle")
    service_type = params.get("service_type", "General Service")
    date = params.get("date", (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d"))
    time = params.get("time", "10:00 AM")
    enterprise_id = params.get("enterprise_id", 1)

    appointment = models.Appointment(
        customer_id=customer_id,
        vehicle_info=vehicle_info,
        date=date,
        time=time,
        service_type=service_type,
        enterprise_id=enterprise_id,
        status="Confirmed"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return AiActionResponse(
        success=True,
        message=f"Appointment booked for {date} at {time} — {service_type}",
        data={"appointment_id": appointment.id, "date": date, "time": time, "service_type": service_type},
        follow_up=["View appointments", "Add another booking", "Request pick & drop"]
    )


def _action_daily_digest(db: Session) -> AiActionResponse:
    """Generate a daily business digest with AI insights."""
    snapshot = _get_business_snapshot(db)
    j = snapshot["jobs"]
    c = snapshot["customers"]
    f = snapshot["financials"]
    inv = snapshot["inventory"]

    insights = []

    # Job insights
    if j["pending"] > 0:
        insights.append(f"📋 {j['pending']} jobs waiting to be started. Prioritize to improve turnaround time.")
    if j["completed"] > 0:
        insights.append(f"✅ {j['completed']} jobs completed. Great progress!")

    # Inventory insights
    if inv["low_stock_count"] > 0:
        low_items = db.query(models.InventoryItem).filter(models.InventoryItem.stock <= 5).limit(3).all()
        names = [item.name for item in low_items]
        insights.append(f"⚠️ {inv['low_stock_count']} items low on stock: {', '.join(names)}. Consider reordering.")

    # Customer insights
    if c["overdue_followups"] > 0:
        insights.append(f"📞 {c['overdue_followups']} customers overdue for service. Sending reminders improves retention by 30%.")

    # Financial insights
    if f["total_income"] > 0:
        margin = (f["net_profit"] / f["total_income"]) * 100 if f["total_income"] > 0 else 0
        insights.append(f"💰 Profit margin: {margin:.1f}%. Net profit: NPR {f['net_profit']:,.0f}.")

    if not insights:
        insights.append("No activity recorded yet. Start by creating your first job card or adding inventory!")

    return AiActionResponse(
        success=True,
        message="📊 Daily Business Digest",
        data={
            "insights": insights,
            "snapshot": snapshot,
            "generated_at": datetime.utcnow().isoformat()
        },
        follow_up=["View dashboard", "Create job", "Check inventory", "Financial report"]
    )


def _action_smart_reorder(db: Session) -> AiActionResponse:
    """AI-powered smart reorder suggestions based on stock levels and usage patterns."""
    low_items = db.query(models.InventoryItem).filter(models.InventoryItem.stock <= 5).all()

    suggestions = []
    for item in low_items:
        suggested_qty = max(10, 20 - item.stock)  # Simple reorder logic
        suggestions.append({
            "id": item.id,
            "name": item.name,
            "current_stock": item.stock,
            "suggested_order_qty": suggested_qty,
            "estimated_cost": suggested_qty * item.price,
            "category": item.category
        })

    total_cost = sum(s["estimated_cost"] for s in suggestions)

    if suggestions:
        msg = f"🔄 {len(suggestions)} items need restocking. Estimated total cost: NPR {total_cost:,.0f}."
    else:
        msg = "All inventory levels are healthy! No reorders needed."

    return AiActionResponse(
        success=True,
        message=msg,
        data={"reorder_suggestions": suggestions, "total_estimated_cost": total_cost},
        follow_up=["Place orders", "View marketplace", "Adjust stock levels"]
    )
