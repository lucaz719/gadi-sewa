import { Selector } from 'testcafe';
import { loginAs, logout, captureStep, navigateTo, fillField, clickButton, verifyToast, waitForApiCall } from '../helpers/auth';
import { TEST_USERS, WORKFLOW_STEPS, TEST_COMPLAINTS } from '../data/users';

fixture('Garage Owner Complete Workflow')
    .page('http://localhost:3000')
    .beforeEach(async t => {
        console.log('\n' + '='.repeat(60));
        console.log('🏢 GARAGE OWNER WORKFLOW TEST');
        console.log('='.repeat(60) + '\n');
    });

test('Complete Garage Owner Journey', async t => {
    const steps = WORKFLOW_STEPS.garage;
    let stepNumber = 1;

    // Step 1: Login as Garage Owner
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[0]}`);
    await loginAs('garage');
    await captureStep('garage-01-login', 'Logged in as Garage Owner');
    await t.expect(Selector('h1').withText('GadiSewa').exists).ok('Should see GadiSewa logo');
    await t.wait(2000);

    // Step 2: View Dashboard Statistics
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[1]}`);
    await captureStep('garage-02-dashboard', 'Viewing dashboard with statistics');

    // Verify dashboard elements
    await t.expect(Selector('h2').withText('Dashboard').exists).ok('Should see Dashboard title');
    await t.expect(Selector('div').withText(/Today's Schedule|Pending Jobs|Active Vehicles/i).exists).ok('Should see stat cards');
    await t.wait(2000);

    // Step 3: Create New Job Card
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[2]}`);
    await navigateTo('Job Board');
    await t.wait(1000);
    await captureStep('garage-03-job-board', 'Navigated to Job Board');

    // Click Create Job button
    const createJobBtn = Selector('main a, main button').withText(/Create|New Job/i).filterVisible();
    if (await createJobBtn.exists) {
        await t.click(createJobBtn);
        await t.wait(1000);
    } else {
        await navigateTo('/jobs/new');
    }

    await captureStep('garage-04-create-job-form', 'Create Job form opened');

    // Step 1: Customer Info (Search and then Next)
    console.log('   👤 Selecting Customer...');
    await fillField('Search customer', '9876543210'); // Search by phone from mock
    await t.wait(1000);
    const resultItem = Selector('div').withText(/John.*9876543210/).filterVisible();
    if (await resultItem.exists) {
        await t.click(resultItem);
    }
    await t.wait(500);
    await t.click(Selector('[data-testid="next-step"]'));

    // Step 2: Vehicle Details
    console.log('   🚗 Entering Vehicle Details...');
    await fillField('Registration No', 'MH-01-AB-1234');
    await t.click(Selector('[data-testid="next-step"]'));

    // Step 3: Service & Issues
    console.log('   🔧 Filling Complaints...');
    await fillField('Customer Complaints', TEST_COMPLAINTS[0].complaint);
    await t.wait(1000);
    await captureStep('garage-05-job-form-filled', 'Job form filled with customer details');

    // Step 4: Use AI Complaint Analysis
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[3]}`);
    const aiButton = Selector('button, a').withText(/AI|Analyze|GadiAI/i).filterVisible();

    if (await aiButton.exists) {
        await t.click(aiButton);
        console.log('   ⏳ Waiting for AI analysis...');
        await t.wait(5000); // Wait for AI response
        await captureStep('garage-06-ai-analysis', 'AI complaint analysis completed');
    } else {
        console.log('   ⚠️ AI button not found, skipping AI analysis');
    }

    // Save the job (Final button is "Create Job Card")
    await t.click(Selector('[data-testid="next-step"]'));
    await waitForApiCall(2000);
    await captureStep('garage-07-job-created', 'Job card created successfully');

    // Step 5: Add Inventory Item
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[4]}`);
    await navigateTo('Inventory');
    await t.wait(1000);
    await captureStep('garage-08-inventory-page', 'Navigated to Inventory');

    const addItemBtn = Selector('button, a').withText(/Add|New Item/i).filterVisible();
    if (await addItemBtn.exists) {
        await t.click(addItemBtn);
        await t.wait(1000);

        // Fill inventory item details
        await fillField('Name', 'Test Engine Oil 5W-30');
        await fillField('SKU', 'TEST-EO-001');
        await fillField('Price', '2500');
        await fillField('Stock', '50');
        await t.wait(500);
        await captureStep('garage-09-inventory-form', 'Inventory item form filled');

        await clickButton('Add to Inventory');
        await waitForApiCall(2000);
        await captureStep('garage-10-inventory-added', 'Inventory item added');
    }

    // Step 6: Process POS Sale
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[5]}`);
    await navigateTo('POS');
    await t.wait(2000);
    await captureStep('garage-11-pos-page', 'Navigated to POS system');

    // Add item to cart (if inventory exists)
    const firstItem = Selector('div').withText(/Engine Oil|Brake|Filter/i).nth(0);
    if (await firstItem.exists) {
        await t.click(firstItem);
        await t.wait(1000);
        await captureStep('garage-12-pos-item-added', 'Item added to cart');

        // Complete sale
        const checkoutBtn = Selector('button, a').withText(/Checkout|Complete|Pay/i).filterVisible();
        if (await checkoutBtn.exists) {
            await t.click(checkoutBtn);
            await t.wait(1000);
            await captureStep('garage-13-pos-checkout', 'Processing checkout');

            const confirmBtn = Selector('button, a').withText(/Confirm|Pay|Complete/i).filterVisible();
            if (await confirmBtn.exists) {
                await t.click(confirmBtn);
                await waitForApiCall(2000);
                await captureStep('garage-14-pos-completed', 'Sale completed');
            }
        }
    }

    // Step 7: View Financial Reports
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[6]}`);
    await navigateTo('Cash Flow');
    await t.wait(1000);
    await captureStep('garage-15-financials', 'Viewing financial reports');

    // Step 8: Manage Staff
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[7]}`);
    await navigateTo('Staff');
    await t.wait(1000);
    await captureStep('garage-16-staff', 'Viewing staff management');

    // Step 9: Logout
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[8]}`);
    await logout();
    await t.wait(1000);
    await captureStep('garage-17-logout', 'Logged out successfully');

    console.log('\n' + '='.repeat(60));
    console.log('✅ GARAGE OWNER WORKFLOW COMPLETED');
    console.log('='.repeat(60) + '\n');
});
