import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_ai_analysis():
    """Test AI complaint analysis with the new API key"""
    print("Testing AI Complaint Analysis...")
    print("-" * 50)
    
    complaint_data = {
        "complaint": "Engine making unusual noise and vibrating heavily",
        "vehicleInfo": "Toyota Camry 2020"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/ai/analyze-complaint",
            json=complaint_data,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ AI Analysis Successful!")
            print("\nAnalysis Result:")
            print(json.dumps(result, indent=2))
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_ai_analysis()
