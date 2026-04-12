
import requests
import json

BASE_URL = "http://localhost:8000"

def test_login_invalid():
    print("\n[Deep Test] - Invalid Login Check")
    response = requests.post(f"{BASE_URL}/auth/login", json={"email": "wrong@test.com", "password": ""})
    print(f"Status: {response.status_code}, Body: {response.json()}")

def test_unauthorized_dashboard():
    print("\n[Deep Test] - Unauthorized Admin Access")
    response = requests.get(f"{BASE_URL}/admin/dashboard")
    print(f"Status: {response.status_code}, Body: {response.json()}")

def test_malformed_job_card():
    print("\n[Deep Test] - Malformed Job Card Validation")
    # Missing required enterprise_id and customer_id
    payload = {"vehicle_number": "BA 1 PA 1234"} 
    response = requests.post(f"{BASE_URL}/jobs/", json=payload)
    print(f"Status: {response.status_code}, Body: {response.json()}")

if __name__ == "__main__":
    try:
        test_login_invalid()
        test_unauthorized_dashboard()
        test_malformed_job_card()
    except Exception as e:
        print(f"Error connecting to backend: {e}")
