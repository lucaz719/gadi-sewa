from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class ChatRequest(BaseModel):
    message: str
    user_role: str
    current_path: str

class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str]
    action: Optional[str] = None # e.g. "navigate:/jobs"

@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    msg = req.message.lower()
    
    # Context-aware logic
    if "job" in msg or "work" in msg:
        if req.user_role == "admin":
            return {
                "reply": "As an Admin, you can view all active jobs or create new one in the Job Board.",
                "suggestions": ["Go to Job Board", "View Staff Assignments"],
                "action": "navigate:/jobs"
            }
        else:
            return {
                "reply": "You can track your vehicle's service progress in the Service History section.",
                "suggestions": ["View History", "Book New Service"],
                "action": "navigate:/portal/history"
            }
            
    if "points" in msg or "reward" in msg:
        return {
            "reply": "GadiPoints are earned for every service and referral. You can redeem them in the Rewards Hub.",
            "suggestions": ["Open Rewards Hub", "How to earn more?"],
            "action": "navigate:/portal/offers"
        }

    if "refer" in msg:
        return {
            "reply": "Invite your friends using your unique code to earn 500 GadiPoints!",
            "suggestions": ["Generate Referral Code", "See my referrals"],
            "action": "navigate:/portal/offers"
        }

    return {
        "reply": f"I'm your GadiSewa Assistant. I see you're currently at {req.current_path}. How can I help you today?",
        "suggestions": ["Book a service", "Check Marketplace", "Manage Inventory"],
    }
