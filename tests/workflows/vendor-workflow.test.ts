import { Selector } from 'testcafe';
import { loginAs, logout, captureStep, navigateTo, fillField, clickButton, waitForApiCall } from '../helpers/auth';
import { WORKFLOW_STEPS, TEST_VENDOR_PRODUCTS } from '../data/users';

fixture('Vendor Complete Workflow')
    .page('http://localhost:3000')
    .beforeEach(async t => {
        console.log('\n' + '='.repeat(60));
        console.log('🏭 VENDOR WORKFLOW TEST');
        console.log('='.repeat(60) + '\n');
    });

test('Complete Vendor Journey', async t => {
    const steps = WORKFLOW_STEPS.vendor;
    let stepNumber = 1;

    // Step 1: Login as Vendor
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[0]}`);
    await loginAs('vendor');
    await captureStep('vendor-01-login', 'Logged in as Vendor');
    await t.expect(Selector('h1').withText('GadiSewa').exists).ok('Should see GadiSewa logo');
    await t.expect(Selector('p').withText('Vendor Portal').exists).ok('Should see Vendor Portal label');
    await t.wait(2000);

    // Step 2: View Vendor Dashboard
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[1]}`);
    await captureStep('vendor-02-dashboard', 'Viewing vendor dashboard');

    // Verify vendor dashboard elements
    await t.expect(Selector('h2').withText(/Dashboard|Vendor/i).exists).ok('Should see dashboard');
    await t.wait(2000);

    // Step 3: Add Product to Catalog
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[2]}`);
    await navigateTo('Product Catalog');
    await t.wait(1000);
    await captureStep('vendor-03-products-page', 'Navigated to Product Catalog');

    const addProductBtn = Selector('a, button').withText(/Add/i).withText(/Product/i);
    if (await addProductBtn.exists) {
        await t.click(addProductBtn);
        await t.wait(1000);
        await captureStep('vendor-04-add-product-form', 'Add product form opened');

        // Fill product details
        const product = TEST_VENDOR_PRODUCTS[0];
        await fillField('Name', product.name);
        await fillField('SKU', product.sku);
        await fillField('Price', product.price.toString());
        await fillField('Stock', product.stock.toString());

        const descField = Selector('textarea');
        if (await descField.exists) {
            await t.typeText(descField, product.description);
        }

        await t.wait(500);
        await captureStep('vendor-05-product-form-filled', 'Product details filled');

        await clickButton('Save');
        await waitForApiCall(2000);
        await captureStep('vendor-06-product-added', 'Product added to catalog');
    } else {
        console.log('   ⚠️  Add Product button not found');
    }

    // Step 4: View Orders
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[3]}`);
    await navigateTo('Orders');
    await t.wait(1000);
    await captureStep('vendor-07-orders-page', 'Viewing orders from garages');

    // Step 5: Check Garage Network
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[4]}`);
    await navigateTo('Garage Network');
    await t.wait(1000);
    await captureStep('vendor-08-network-page', 'Viewing connected garages');

    // Step 6: View Financials
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[5]}`);
    await navigateTo('Financials');
    await t.wait(1000);
    await captureStep('vendor-09-financials', 'Viewing vendor financials');

    // Step 7: Update Product Stock
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[6]}`);
    await navigateTo('Product Catalog');
    await t.wait(1000);

    const firstProduct = Selector('tr').nth(1); // First product row
    if (await firstProduct.exists) {
        const editBtn = firstProduct.find('button').withText(/Edit/i);
        if (await editBtn.exists) {
            await t.click(editBtn);
            await t.wait(1000);
            await captureStep('vendor-10-edit-product', 'Editing product stock');

            // Update stock
            const stockField = Selector('input').withAttribute('type', 'number');
            if (await stockField.exists) {
                await t
                    .click(stockField)
                    .pressKey('ctrl+a delete')
                    .typeText(stockField, '250');

                await clickButton('Save');
                await waitForApiCall(2000);
                await captureStep('vendor-11-stock-updated', 'Product stock updated');
            }
        }
    }

    // Step 8: Logout
    console.log(`\n📍 Step ${stepNumber++}/${steps.length}: ${steps[7]}`);
    await logout();
    await t.wait(1000);
    await captureStep('vendor-12-logout', 'Logged out successfully');

    console.log('\n' + '='.repeat(60));
    console.log('✅ VENDOR WORKFLOW COMPLETED');
    console.log('='.repeat(60) + '\n');
});
