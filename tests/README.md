# TestCafe E2E Testing Guide

## Overview
This project uses TestCafe for end-to-end testing of the GadiSewa garage management system.

## Prerequisites
- Node.js installed
- Frontend running on `http://localhost:5173`
- Backend running on `http://localhost:8000`

## Installation
TestCafe is already included in `devDependencies`. If you need to reinstall:
```bash
npm install
```

## Running Tests

### All Tests (Chrome)
```bash
npm run test:e2e
```

### Headless Mode (CI/CD)
```bash
npm run test:e2e:headless
```

### Firefox Browser
```bash
npm run test:e2e:firefox
```

### Specific Test File
```bash
npx testcafe chrome tests/fixtures/inventory.test.ts
```

## Test Structure

```
tests/
├── fixtures/           # Test files
│   ├── dashboard.test.ts
│   ├── inventory.test.ts
│   ├── jobs.test.ts
│   └── pos.test.ts
├── helpers/            # Utilities
│   ├── selectors.ts    # Centralized selectors
│   └── utils.ts        # Helper functions
└── data/               # Test data
    └── test-data.ts
```

## Test Coverage

### Dashboard Tests
- ✅ Display statistics and charts
- ✅ Navigation to different sections
- ✅ Onboarding modal interaction

### Inventory Tests
- ✅ Add new inventory items
- ✅ Edit existing items
- ✅ Delete items
- ✅ Search functionality

### Job Management Tests
- ✅ Create job cards
- ✅ AI complaint analysis
- ✅ Multi-step wizard navigation
- ✅ Form validation

### POS Tests
- ✅ Add products to cart
- ✅ Update quantities
- ✅ Apply discounts
- ✅ Complete sales (cash/card)
- ✅ Hold and recall carts

## Configuration

Test configuration is in `.testcaferc.js`:
- Screenshots saved to `tests/screenshots/`
- Videos saved to `tests/videos/`
- Reports saved to `tests/reports/`

## Writing New Tests

1. Create a new file in `tests/fixtures/`
2. Import helpers:
```typescript
import { Selector } from 'testcafe';
import { Selectors } from '../helpers/selectors';
import { waitForApiCall } from '../helpers/utils';
```

3. Define fixture and tests:
```typescript
fixture('My Feature')
    .page('http://localhost:5173/my-page');

test('Should do something', async t => {
    await t
        .click(Selector('button'))
        .expect(Selector('.result').exists).ok();
});
```

## Best Practices

1. **Use Selectors Helper**: Centralize selectors in `helpers/selectors.ts`
2. **Wait for API Calls**: Use `waitForApiCall()` after actions that trigger backend requests
3. **Isolate Tests**: Each test should be independent
4. **Descriptive Names**: Use clear, descriptive test names
5. **Screenshots**: Automatically captured on failures

## Troubleshooting

### Tests Failing
- Ensure frontend is running on port 5173
- Ensure backend is running on port 8000
- Check browser compatibility
- Review screenshots in `tests/screenshots/`

### Slow Tests
- Reduce `waitForApiCall()` timeouts
- Use headless mode for faster execution
- Run specific test files instead of all tests

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run E2E Tests
  run: npm run test:e2e:headless
```
