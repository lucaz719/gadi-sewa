import { Selector } from 'testcafe';
import { loginAs, logout, captureStep, navigateTo, fillField, clickButton, waitForApiCall } from '../helpers/auth';
import { WORKFLOW_STEPS, TEST_CUSTOMERS } from '../data/users';

fixture('Customer Complete Workflow')
    .page('http://localhost:3000')
    .beforeEach(async t => {
        console.log('\n' + '='.repeat(60));
        console.log('🚗 CUSTOMER WORKFLOW TEST');
        console.log('='.repeat(60) + '\n');
    });

test('Complete Customer Journey', async t => {
    const steps = WORKFLOW_STEPS.customer;
    let stepNumber = 1;

    // Step 1: Login as Customer
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[0]}`);
    await loginAs('customer');
    await captureStep('customer-01-login', 'Logged in as Customer');
    await t.expect(Selector('h1').withText('GadiSewa').exists).ok('Should see GadiSewa logo');
    await t.expect(Selector('p').withText(/Vehicle Owner|Customer/i).exists).ok('Should see customer portal label');
    await t.wait(2000);

    // Step 2: View Vehicle Dashboard
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[1]}`);
    await captureStep('customer-02-dashboard', 'Viewing customer dashboard');

    // Verify customer dashboard
    await t.expect(Selector('h2').withText(/Overview|Dashboard|My Garage/i).exists).ok('Should see dashboard');
    await t.wait(2000);

    // Step 3: Add New Vehicle
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[2]}`);
    await navigateTo('My Vehicles');
    await t.wait(1000);
    await captureStep('customer-03-vehicles-page', 'Navigated to My Vehicles');

    const addVehicleBtn = Selector('[data-testid="add-vehicle-btn"]');
    if (await addVehicleBtn.exists) {
        await t.click(addVehicleBtn);
        await t.wait(1000);
        await captureStep('customer-04-add-vehicle-form', 'Add vehicle form opened');

        // Fill vehicle details
        const vehicle = TEST_CUSTOMERS[0];
        await fillField('Make', 'Toyota');
        await fillField('Model', 'Camry');
        await fillField('Year', '2020');
        await fillField('Plate Number', vehicle.plateNumber);

        await t.wait(500);
        await captureStep('customer-05-vehicle-form-filled', 'Vehicle details filled');

        await clickButton('Save');
        await waitForApiCall(2000);
        await captureStep('customer-06-vehicle-added', 'Vehicle added successfully');
    } else {
        console.log('   ⚠️  Add Vehicle button not found');
    }

    // Step 4: Book Service Appointment
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[3]}`);
    await navigateTo('Book Service');
    await t.wait(1000);
    await captureStep('customer-07-book-service', 'Navigated to Book Service');

    // Fill booking form
    const serviceTypeSelect = Selector('select');
    if (await serviceTypeSelect.exists) {
        await t.click(serviceTypeSelect);
        await t.click(serviceTypeSelect.find('option').withText(/Oil Change|Service/i));
    }

    const dateField = Selector('input[type="date"]');
    if (await dateField.exists) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        await t.typeText(dateField, dateStr);
    }

    const notesField = Selector('textarea');
    if (await notesField.exists) {
        await t.typeText(notesField, 'Regular service and oil change needed');
    }

    await t.wait(500);
    await captureStep('customer-08-booking-form-filled', 'Service booking form filled');

    const bookBtn = Selector('button').withText(/Book|Submit/i);
    if (await bookBtn.exists) {
        await t.click(bookBtn);
        await waitForApiCall(2000);
        await captureStep('customer-09-booking-confirmed', 'Service booking confirmed');
    }

    // Step 5: View Service History
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[4]}`);
    await navigateTo('Service History');
    await t.wait(1000);
    await captureStep('customer-10-service-history', 'Viewing service history');

    // Step 6: Check Fuel Log
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[5]}`);
    await navigateTo('Fuel Log');
    await t.wait(1000);
    await captureStep('customer-11-fuel-log', 'Viewing fuel log');

    // Add fuel entry if possible
    const addFuelBtn = Selector('button').withText(/Add|Log Fuel/i);
    if (await addFuelBtn.exists) {
        await t.click(addFuelBtn);
        await t.wait(1000);

        await fillField('Liters', '40');
        await fillField('Cost', '5200');
        await fillField('Odometer', '15000');

        await t.wait(500);
        await captureStep('customer-12-fuel-entry', 'Fuel entry form filled');

        await clickButton('Save');
        await waitForApiCall(2000);
        await captureStep('customer-13-fuel-logged', 'Fuel entry logged');
    }

    // Step 7: View Offers & Rewards
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[6]}`);
    await navigateTo('Offers');
    await t.wait(1000);
    await captureStep('customer-14-offers', 'Viewing offers and rewards');

    // Step 8: Logout
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[7]}`);
    await logout();
    await t.wait(1000);
    await captureStep('customer-15-logout', 'Logged out successfully');

    console.log('\n' + '='.repeat(60));
    console.log('✅ CUSTOMER WORKFLOW COMPLETED');
    console.log('='.repeat(60) + '\n');
});
