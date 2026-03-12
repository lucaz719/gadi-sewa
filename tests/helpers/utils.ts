import { t } from 'testcafe';

// Helper to wait for API calls to complete
export async function waitForApiCall(timeout = 3000) {
    await t.wait(timeout);
}

// Helper to clear database via API (for test isolation)
export async function resetTestData() {
    // This would call a test-only endpoint to reset the database
    // For now, we'll skip this as it requires backend changes
    console.log('Test data reset skipped - implement backend endpoint if needed');
}

// Helper to generate random test data
export function generateTestData() {
    const timestamp = Date.now();
    return {
        inventory: {
            name: `Test Item ${timestamp}`,
            sku: `SKU-${timestamp}`,
            category: 'Parts',
            vehicleType: 'Car',
            stock: Math.floor(Math.random() * 100),
            price: Math.floor(Math.random() * 10000),
            unit: 'piece'
        },
        customer: {
            name: `Test Customer ${timestamp}`,
            phone: `+977-${timestamp.toString().slice(-10)}`,
            email: `test${timestamp}@example.com`
        }
    };
}

// Helper to take screenshot with custom name
export async function takeScreenshot(name: string) {
    await t.takeScreenshot(name);
}

// Helper to check if element exists
export async function elementExists(selector: string): Promise<boolean> {
    const element = await t.tryGetSelector(selector);
    return element !== null;
}

// Helper to wait for element to appear
export async function waitForElement(selector: string, timeout = 5000) {
    await t.expect(t.selector(selector).exists).ok({ timeout });
}

// Helper to verify toast message
export async function verifyToast(message: string) {
    const toast = t.selector('.toast, [role="alert"]');
    await t.expect(toast.textContent).contains(message, { timeout: 5000 });
}
