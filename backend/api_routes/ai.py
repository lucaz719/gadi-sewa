from fastapi import APIRouter, Depends, HTTPException
import google.generativeai as genai
import os
from pydantic import BaseModel
from typing import List, Optional
from api_routes.dependencies import get_current_user

router = APIRouter(prefix="/ai", tags=["AI"])

# Load API Key (In production, use a more secure way to load env vars)
GENI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENI_API_KEY:
    genai.configure(api_key=GENI_API_KEY)

class ComplaintAnalysisRequest(BaseModel):
    complaint: str
    vehicleInfo: str

@router.post("/analyze-complaint")
async def analyze_complaint(request: ComplaintAnalysisRequest, _user=Depends(get_current_user)):
    if not GENI_API_KEY:
        raise HTTPException(status_code=500, detail="AI API Key not configured")
    
    model = genai.GenerativeModel('gemini-2.5-flash')  # Using Gemini 2.5 Flash
    prompt = f"""
    Analyze this vehicle issue for a garage job card. 
    Vehicle: {request.vehicleInfo}
    Complaint: {request.complaint}
    
    Provide output as JSON with:
    - possibleCauses (array of strings)
    - suggestedSteps (array of strings)
    - estimatedLaborHours (number)
    - requiredPartsSuggestions (array of strings)
    """
    
    try:
        response = model.generate_content(prompt)
        # Note: In a real app, you'd want to use responseSchema and responseMimeType
        # but for this demonstration, we'll keep it simple or parse the text.
        return {"raw_response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/parts-catalog")
async def get_parts_catalog(_user=Depends(get_current_user)):
    # Similar logic for fetching global parts list
    return {"message": "AI Catalog functionality to be implemented"}
