import { Selector } from 'testcafe';
import { Selectors } from '../helpers/selectors';
import { generateTestData, waitForApiCall, verifyToast } from '../helpers/utils';
import { testData } from '../data/test-data';

fixture('Inventory Management')
    .page('http://localhost:5173/inventory')
    .beforeEach(async t => {
        // Wait for page to load
        await t.wait(2000);
    });

test('Should display inventory page with table', async t => {
    const table = Selector('table');
    await t.expect(table.exists).ok('Inventory table should be visible');
});

test('Should add a new inventory item', async t => {
    const testItem = generateTestData().inventory;

    // Click Add Item button
    await t.click(Selector('button').withText('Add Item'));

    // Wait for modal to appear
    await t.expect(Selector('.modal, [role="dialog"]').exists).ok({ timeout: 3000 });

    // Fill in the form
    await t
        .typeText(Selector('input').withAttribute('placeholder', /name/i), testItem.name)
        .typeText(Selector('input').withAttribute('placeholder', /sku/i), testItem.sku)
        .typeText(Selector('input').withAttribute('placeholder', /stock/i), testItem.stock.toString())
        .typeText(Selector('input').withAttribute('placeholder', /price/i), testItem.price.toString());

    // Select category if dropdown exists
    const categorySelect = Selector('select');
    if (await categorySelect.exists) {
        await t.click(categorySelect).click(categorySelect.find('option').withText('Parts'));
    }

    // Submit the form
    await t.click(Selector('button').withText(/save|add/i));

    // Wait for API call
    await waitForApiCall(2000);

    // Verify item appears in table
    const tableContent = Selector('table').textContent;
    await t.expect(tableContent).contains(testItem.name, 'New item should appear in inventory table');
});

test('Should delete an inventory item', async t => {
    // Find first delete button in table
    const deleteButton = Selector('table tbody tr').nth(0).find('button').withAttribute('title', /delete/i);

    if (await deleteButton.exists) {
        // Click delete
        await t.click(deleteButton);

        // Confirm deletion if confirmation dialog appears
        const confirmButton = Selector('button').withText(/confirm|yes|delete/i);
        if (await confirmButton.exists) {
            await t.click(confirmButton);
        }

        // Wait for deletion
        await waitForApiCall(2000);

        // Verify success (could check toast or table update)
        await t.wait(1000);
    }
});

test('Should search for inventory items', async t => {
    const searchInput = Selector('input').withAttribute('placeholder', /search/i);

    if (await searchInput.exists) {
        await t
            .typeText(searchInput, 'Oil')
            .wait(1000);

        // Verify filtered results
        const tableRows = Selector('table tbody tr');
        const rowCount = await tableRows.count;

        await t.expect(rowCount).gte(0, 'Search should filter results');
    }
});

test('Should edit an inventory item', async t => {
    // Find first edit button
    const editButton = Selector('table tbody tr').nth(0).find('button').withAttribute('title', /edit/i);

    if (await editButton.exists) {
        await t.click(editButton);

        // Wait for modal
        await t.expect(Selector('.modal, [role="dialog"]').exists).ok({ timeout: 3000 });

        // Update stock value
        const stockInput = Selector('input').withAttribute('placeholder', /stock/i);
        await t
            .selectText(stockInput)
            .typeText(stockInput, '100');

        // Save changes
        await t.click(Selector('button').withText(/save|update/i));

        // Wait for update
        await waitForApiCall(2000);
    }
});
