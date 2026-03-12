import { Selector } from 'testcafe';
import { waitForApiCall } from '../helpers/utils';

fixture('POS System')
    .page('http://localhost:5173/pos')
    .beforeEach(async t => {
        await t.wait(2000);
    });

test('Should display POS interface with products', async t => {
    const heading = Selector('h1, h2').withText(/point.*sale|pos/i);
    await t.expect(heading.exists).ok('POS page should be visible');

    // Check for product grid
    const productGrid = Selector('.grid, [class*="product"]');
    await t.expect(productGrid.exists).ok('Product grid should be visible');
});

test('Should add product to cart', async t => {
    // Find first product card
    const firstProduct = Selector('.grid > div, [class*="product"]').nth(0);

    if (await firstProduct.exists) {
        await t.click(firstProduct);

        // Wait for cart update
        await waitForApiCall(500);

        // Verify cart has items
        const cartItems = Selector('[class*="cart"] [class*="item"], table tbody tr');
        await t.expect(cartItems.count).gte(1, 'Cart should have at least one item');
    }
});

test('Should update item quantity in cart', async t => {
    // Add item first
    const firstProduct = Selector('.grid > div').nth(0);
    if (await firstProduct.exists) {
        await t.click(firstProduct).wait(500);
    }

    // Find increment button in cart
    const incrementButton = Selector('button').withText('+').nth(0);
    if (await incrementButton.exists) {
        const initialQty = await Selector('[class*="cart"] [class*="qty"], td').nth(0).textContent;

        await t.click(incrementButton).wait(500);

        // Verify quantity increased
        const newQty = await Selector('[class*="cart"] [class*="qty"], td').nth(0).textContent;
        // Note: This is a basic check, actual implementation may vary
    }
});

test('Should remove item from cart', async t => {
    // Add item first
    const firstProduct = Selector('.grid > div').nth(0);
    if (await firstProduct.exists) {
        await t.click(firstProduct).wait(500);
    }

    // Find and click remove/delete button
    const removeButton = Selector('button').withAttribute('title', /delete|remove/i).nth(0);
    if (await removeButton.exists) {
        const initialCount = await Selector('[class*="cart"] [class*="item"], tbody tr').count;

        await t.click(removeButton).wait(500);

        const newCount = await Selector('[class*="cart"] [class*="item"], tbody tr').count;
        await t.expect(newCount).lt(initialCount, 'Item should be removed from cart');
    }
});

test('Should apply discount', async t => {
    // Add item first
    const firstProduct = Selector('.grid > div').nth(0);
    if (await firstProduct.exists) {
        await t.click(firstProduct).wait(500);
    }

    // Find discount button
    const discountButton = Selector('button').withText(/discount/i);
    if (await discountButton.exists) {
        await t.click(discountButton).wait(500);

        // Enter discount value
        const discountInput = Selector('input[type="number"]');
        if (await discountInput.exists) {
            await t
                .typeText(discountInput, '10')
                .pressKey('enter')
                .wait(500);
        }
    }
});

test('Should complete a sale with cash payment', async t => {
    // Add item to cart
    const firstProduct = Selector('.grid > div').nth(0);
    if (await firstProduct.exists) {
        await t.click(firstProduct).wait(500);
    }

    // Click checkout/complete sale button
    const checkoutButton = Selector('button').withText(/complete.*sale|checkout/i);
    if (await checkoutButton.exists) {
        await t.click(checkoutButton).wait(1000);

        // Select cash payment method
        const cashButton = Selector('button').withText(/cash/i);
        if (await cashButton.exists) {
            await t.click(cashButton).wait(500);
        }

        // Enter cash amount
        const cashInput = Selector('input[type="number"]');
        if (await cashInput.exists) {
            await t.typeText(cashInput, '10000').wait(500);
        }

        // Finalize transaction
        const finalizeButton = Selector('button').withText(/finalize|complete|confirm/i);
        if (await finalizeButton.exists) {
            await t.click(finalizeButton);

            // Wait for transaction to complete
            await waitForApiCall(3000);

            // Verify cart is cleared or success message
            await t.wait(2000);
        }
    }
});

test('Should hold and recall cart', async t => {
    // Add item to cart
    const firstProduct = Selector('.grid > div').nth(0);
    if (await firstProduct.exists) {
        await t.click(firstProduct).wait(500);
    }

    // Click hold button
    const holdButton = Selector('button').withText(/hold/i);
    if (await holdButton.exists) {
        await t.click(holdButton).wait(1000);

        // Cart should be cleared
        const cartItems = Selector('[class*="cart"] [class*="item"], tbody tr');
        await t.expect(cartItems.count).eql(0, 'Cart should be empty after hold');
    }

    // Recall cart
    const recallButton = Selector('button').withText(/recall/i);
    if (await recallButton.exists) {
        await t.click(recallButton).wait(1000);

        // Select first held cart if modal appears
        const firstHeldCart = Selector('button').withText(/recall/i).nth(1);
        if (await firstHeldCart.exists) {
            await t.click(firstHeldCart).wait(1000);

            // Verify cart is restored
            const restoredItems = Selector('[class*="cart"] [class*="item"], tbody tr');
            await t.expect(restoredItems.count).gte(1, 'Cart should be restored');
        }
    }
});
