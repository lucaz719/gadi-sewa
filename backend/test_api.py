import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_inventory_crud():
    """Test Inventory CRUD operations"""
    print("\n=== TESTING INVENTORY MODULE ===")
    
    # 1. CREATE - Add inventory item
    print("\n1. Testing POST /api/inventory (Create)")
    new_item = {
        "name": "Engine Oil 5W-30",
        "sku": "EO-5W30-TEST",
        "category": "Oils",
        "vehicle_type": "Car",
        "stock": 50,
        "price": 2500.0,
        "unit": "liter"
    }
    response = requests.post(f"{BASE_URL}/inventory/", json=new_item)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        created_item = response.json()
        print(f"Created Item ID: {created_item['id']}")
        item_id = created_item['id']
    else:
        print(f"Error: {response.text}")
        return
    
    # 2. READ - Get all inventory
    print("\n2. Testing GET /api/inventory (Read All)")
    response = requests.get(f"{BASE_URL}/inventory/")
    print(f"Status: {response.status_code}")
    items = response.json()
    print(f"Total Items: {len(items)}")
    
    # 3. UPDATE STOCK - Update stock level
    print("\n3. Testing POST /api/inventory/update-stock (Update Stock)")
    stock_update = {
        "skuOrName": "EO-5W30-TEST",
        "change": -10
    }
    response = requests.post(f"{BASE_URL}/inventory/update-stock", json=stock_update)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"New Stock: {result['new_stock']}")
    
    # 4. DELETE - Remove item
    print("\n4. Testing DELETE /api/inventory/{id} (Delete)")
    response = requests.delete(f"{BASE_URL}/inventory/{item_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_jobs_crud():
    """Test Jobs CRUD operations"""
    print("\n\n=== TESTING JOBS MODULE ===")
    
    # 1. CREATE - Create job
    print("\n1. Testing POST /api/jobs (Create)")
    new_job = {
        "customer_id": 1,
        "vehicle_info": "Toyota Camry 2020",
        "complaint": "Engine making unusual noise",
        "status": "Pending",
        "labor_cost": 5000.0
    }
    response = requests.post(f"{BASE_URL}/jobs/", json=new_job)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        created_job = response.json()
        print(f"Created Job ID: {created_job['id']}")
        job_id = created_job['id']
    else:
        print(f"Error: {response.text}")
        return
    
    # 2. READ - Get all jobs
    print("\n2. Testing GET /api/jobs (Read All)")
    response = requests.get(f"{BASE_URL}/jobs/")
    print(f"Status: {response.status_code}")
    jobs = response.json()
    print(f"Total Jobs: {len(jobs)}")
    
    # 3. UPDATE - Update job status
    print("\n3. Testing PATCH /api/jobs/{id} (Update)")
    update_data = {
        "status": "In Progress",
        "labor_cost": 6000.0
    }
    response = requests.patch(f"{BASE_URL}/jobs/{job_id}", json=update_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        updated_job = response.json()
        print(f"Updated Status: {updated_job['status']}")
        print(f"Updated Labor Cost: {updated_job['labor_cost']}")

def test_financials():
    """Test Financial transactions"""
    print("\n\n=== TESTING FINANCIALS MODULE ===")
    
    # 1. CREATE - Log transaction
    print("\n1. Testing POST /api/financials/transactions (Create)")
    transaction = {
        "type": "Income",
        "amount": 15000.0,
        "category": "Sales",
        "description": "POS Sale - Engine Oil"
    }
    response = requests.post(f"{BASE_URL}/financials/transactions", json=transaction)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        created_txn = response.json()
        print(f"Transaction ID: {created_txn['id']}")
    
    # 2. READ - Get all transactions
    print("\n2. Testing GET /api/financials/transactions (Read All)")
    response = requests.get(f"{BASE_URL}/financials/transactions")
    print(f"Status: {response.status_code}")
    transactions = response.json()
    print(f"Total Transactions: {len(transactions)}")

def test_pos():
    """Test POS operations"""
    print("\n\n=== TESTING POS MODULE ===")
    
    # 1. HOLD CART
    print("\n1. Testing POST /api/pos/held-carts (Hold Cart)")
    cart_data = {
        "customer_name": "John Doe",
        "cart_data": {
            "items": [
                {"name": "Engine Oil", "qty": 2, "price": 2500}
            ]
        },
        "total": 5000
    }
    response = requests.post(f"{BASE_URL}/pos/held-carts", json=cart_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        held_cart = response.json()
        print(f"Held Cart ID: {held_cart['id']}")
        cart_id = held_cart['id']
    else:
        print(f"Error: {response.text}")
        return
    
    # 2. GET HELD CARTS
    print("\n2. Testing GET /api/pos/held-carts (Get Held Carts)")
    response = requests.get(f"{BASE_URL}/pos/held-carts")
    print(f"Status: {response.status_code}")
    held_carts = response.json()
    print(f"Total Held Carts: {len(held_carts)}")
    
    # 3. DELETE HELD CART
    print("\n3. Testing DELETE /api/pos/held-carts/{id} (Remove Held Cart)")
    response = requests.delete(f"{BASE_URL}/pos/held-carts/{cart_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_ai():
    """Test AI integration"""
    print("\n\n=== TESTING AI MODULE ===")
    
    print("\n1. Testing POST /api/ai/analyze-complaint (AI Analysis)")
    print("Note: This requires GEMINI_API_KEY to be set")
    complaint_data = {
        "complaint": "Engine making unusual noise and vibrating",
        "vehicleInfo": "Toyota Camry 2020"
    }
    response = requests.post(f"{BASE_URL}/ai/analyze-complaint", json=complaint_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("AI Analysis successful")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    print("=" * 60)
    print("GADISEWA BACKEND API COMPREHENSIVE TEST")
    print("=" * 60)
    
    try:
        # Test all modules
        test_inventory_crud()
        test_jobs_crud()
        test_financials()
        test_pos()
        test_ai()
        
        print("\n" + "=" * 60)
        print("ALL TESTS COMPLETED")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\nERROR: Cannot connect to backend server")
        print("Please ensure backend is running on http://localhost:8000")
    except Exception as e:
        print(f"\nERROR: {str(e)}")
