# GadiSewa Workflow Testing Guide

## Overview
Comprehensive workflow tests demonstrating complete user journeys for all roles in the GadiSewa system.

## Test Users

### Garage Owner
- **Email:** garage@gadisewa.com
- **Password:** Test@123
- **Role:** Main garage management

### Vendor
- **Email:** vendor@gadisewa.com
- **Password:** Test@123
- **Role:** Parts supplier/distributor

### Customer
- **Email:** customer@gadisewa.com
- **Password:** Test@123
- **Role:** Vehicle owner

## Setup

### 1. Seed Test Data
```bash
cd backend
python seed_data.py
```

This will populate the database with:
- 15 inventory items (oils, filters, brakes, tires, etc.)
- 5 job cards with realistic complaints
- 5 financial transactions

### 2. Start Servers
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --reload --port 8000 --root-path /api

# Terminal 2: Frontend
npm run dev
```

## Running Workflow Tests

### Run All Workflows Sequentially
```bash
npm run test:all
```

### Run Individual Workflows

**Garage Owner Workflow (9 steps):**
```bash
npm run test:garage
```

**Vendor Workflow (8 steps):**
```bash
npm run test:vendor
```

**Customer Workflow (8 steps):**
```bash
npm run test:customer
```

### Run All Workflows in Parallel
```bash
npm run test:workflows
```

### Headless Mode (CI/CD)
```bash
npm run test:workflows:headless
```

## Workflow Steps

### 🏢 Garage Owner Journey
1. Login as Garage Owner
2. View Dashboard Statistics
3. Create New Job Card
4. Use AI Complaint Analysis
5. Add Inventory Item
6. Process POS Sale
7. View Financial Reports
8. Manage Staff
9. Logout

### 🏭 Vendor Journey
1. Login as Vendor
2. View Vendor Dashboard
3. Add Product to Catalog
4. View Orders
5. Check Garage Network
6. View Financials
7. Update Product Stock
8. Logout

### 🚗 Customer Journey
1. Login as Customer
2. View Vehicle Dashboard
3. Add New Vehicle
4. Book Service Appointment
5. View Service History
6. Check Fuel Log
7. View Offers & Rewards
8. Logout

## Screenshots

All workflow tests capture screenshots at each step:
- **Location:** `workflow-screenshots/`
- **Naming:** `{role}-{step}-{description}.png`
- **Example:** `garage-01-login.png`, `vendor-05-product-form-filled.png`

## Test Output

Each test provides detailed console output:
```
============================================================
🏢 GARAGE OWNER WORKFLOW TEST
============================================================

📍 Step 1/9: Login as Garage Owner
📸 garage-01-login: Logged in as Garage Owner

📍 Step 2/9: View Dashboard Statistics
📸 garage-02-dashboard: Viewing dashboard with statistics

...

============================================================
✅ GARAGE OWNER WORKFLOW COMPLETED
============================================================
```

## Customization

### Modify Test Data
Edit `tests/data/users.ts` to change:
- User credentials
- Customer information
- Product details
- Workflow steps

### Add Custom Steps
Edit workflow test files in `tests/workflows/`:
- `garage-owner-workflow.test.ts`
- `vendor-workflow.test.ts`
- `customer-workflow.test.ts`

### Adjust Test Speed
Modify `.testcaferc.js`:
```javascript
{
  speed: 0.5  // 0.01 (fastest) to 1 (slowest)
}
```

## Troubleshooting

### Tests Failing?
1. Ensure both servers are running
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Reseed database: `python backend/seed_data.py`
4. Check console for errors

### Screenshots Not Capturing?
- Ensure `workflow-screenshots/` directory exists
- Check TestCafe has write permissions
- Verify `.testcaferc.js` configuration

### AI Analysis Not Working?
- Verify `GEMINI_API_KEY` in `backend/.env`
- Check backend logs for API errors
- Ensure model is `gemini-2.5-flash`

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Workflow Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/setup-python@v4
      
      - name: Install dependencies
        run: |
          npm install
          pip install -r backend/requirements.txt
      
      - name: Seed database
        run: python backend/seed_data.py
      
      - name: Start servers
        run: |
          npm run dev &
          cd backend && uvicorn main:app --port 8000 &
      
      - name: Run workflow tests
        run: npm run test:workflows:headless
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        with:
          name: workflow-screenshots
          path: workflow-screenshots/
```

## Best Practices

1. **Always seed data before tests** - Ensures consistent state
2. **Run tests sequentially** - Prevents race conditions
3. **Review screenshots** - Visual verification of each step
4. **Update test data** - Keep realistic and current
5. **Monitor test speed** - Balance between speed and reliability

## Support

For issues or questions:
- Check test logs in console
- Review screenshot captures
- Verify server logs
- Ensure all dependencies installed
