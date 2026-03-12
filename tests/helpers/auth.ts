import { Selector, t } from 'testcafe';
import { TEST_USERS } from '../data/users';

/**
 * Handle Onboarding Modal if it appears
 */
async function handleModal() {
    const onboardingBtn = Selector('button').withText(/Get Started/i);
    if (await onboardingBtn.exists) {
        await t.click(onboardingBtn);
        await t.wait(1000);
    }
}

/**
 * Login helper for different user roles
 */
export async function loginAs(role: 'garage' | 'vendor' | 'customer' | 'admin') {
    const user = TEST_USERS[role];

    // Navigate to login page
    await t.navigateTo('http://localhost:3000/#/login');

    // Wait for page to load
    await t.wait(1000);

    // Select role if not admin
    if (role !== 'admin') {
        const roleButton = Selector('button, a').withText(
            role === 'garage' ? 'Garage' :
                role === 'vendor' ? 'Vendor' :
                    'Car Owner'
        );
        await t.click(roleButton);
    } else {
        // Navigate to admin portal
        await t.navigateTo('http://localhost:3000/#/admin-portal');
    }

    // Fill in credentials
    await t
        .typeText(Selector('input[type="text"]'), user.email)
        .typeText(Selector('input[type="password"]'), user.password);

    // Click login button
    const loginButton = Selector('button[type="submit"]');
    await t.click(loginButton);

    // Wait for navigation and handle modal
    await t.wait(2000);
    await handleModal();
}

/**
 * Logout helper
 */
export async function logout() {
    const logoutButton = Selector('button, a').withText(/logout/i);

    if (await logoutButton.exists) {
        await t.click(logoutButton);
        await t.wait(1000);
    }
}

/**
 * Verify user is logged in
 */
export async function verifyLoggedIn(displayName: string) {
    const userAvatar = Selector('div, span').withText(displayName);
    await t.expect(userAvatar.exists).ok(`User ${displayName} should be logged in`);
}

/**
 * Navigate to a specific page
 */
export async function navigateTo(pageName: string) {
    // 1. Check for modal first in case it reappeared
    await handleModal();

    // 2. If it's a relative path, navigate directly
    if (pageName.startsWith('/') || pageName.includes('/')) {
        const hashPath = pageName.startsWith('/') ? pageName : `/${pageName}`;
        await t.navigateTo(`http://localhost:3000/#${hashPath}`);
        await t.wait(2000);
        return;
    }

    // 3. Try to find specifically in Sidebar/Aside (most common navigation)
    const sidebarLink = Selector('aside').find('a, button').withText(new RegExp(`^\\s*${pageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i')).filterVisible();

    if (await sidebarLink.exists) {
        await t.click(sidebarLink);
    } else {
        // 4. Try partial match in aside
        const sidebarPartial = Selector('aside').find('a, button').withText(new RegExp(pageName, 'i')).filterVisible();
        if (await sidebarPartial.exists) {
            await t.click(sidebarPartial);
        } else {
            // 5. Try anywhere in the page (links first)
            const anyLink = Selector('a, button, span').withText(new RegExp(pageName, 'i')).filterVisible();
            if (await anyLink.exists) {
                await t.click(anyLink);
            } else {
                console.log(`⚠️ Navigation might have failed for: ${pageName}`);
            }
        }
    }
    await t.wait(1500); // Give it enough time to transition
}

/**
 * Take screenshot with description
 */
export async function captureStep(stepName: string, description: string) {
    await t.takeScreenshot({
        path: `workflow-${stepName.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: true
    });

    console.log(`📸 ${stepName}: ${description}`);
}

/**
 * Verify toast message appears
 */
export async function verifyToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const toast = Selector('div, span').withText(message);
    await t.expect(toast.exists).ok(`Toast message "${message}" should appear`);
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(timeout: number = 2000) {
    await t.wait(timeout);
}

/**
 * Fill form field
 */
export async function fillField(label: string, value: string) {
    // Try to find label and then find input in the same container or next to it
    const field = Selector('label').withText(new RegExp(label, 'i')).parent().find('input, textarea, select');

    if (await field.exists) {
        await t
            .click(field)
            .pressKey('ctrl+a delete')
            .typeText(field, value);
    } else {
        // Try direct selector by placeholder
        const placeholderField = Selector('input, textarea, select').withAttribute('placeholder', new RegExp(label, 'i'));
        if (await placeholderField.exists) {
            await t
                .click(placeholderField)
                .pressKey('ctrl+a delete')
                .typeText(placeholderField, value);
        } else {
            // Try very broad match
            const genericField = Selector('input, textarea, select').withText(new RegExp(label, 'i'));
            if (await genericField.exists) {
                await t
                    .click(genericField)
                    .pressKey('ctrl+a delete')
                    .typeText(genericField, value);
            }
        }
    }
}

/**
 * Click button by text
 */
export async function clickButton(buttonText: string) {
    // Escape special characters and allow whitespace
    const pattern = new RegExp(`^\\s*${buttonText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i');

    // 1. Try to find exact match in main content first
    const mainButton = Selector('main').find('button, a, div').withText(pattern).filterVisible();
    if (await mainButton.exists) {
        await t.click(mainButton);
    } else {
        // 2. Try partial match in main
        const mainPartial = Selector('main').find('button, a, div').withText(new RegExp(buttonText, 'i')).filterVisible();
        if (await mainPartial.exists) {
            await t.click(mainPartial);
        } else {
            // 3. Try anywhere
            const anyButton = Selector('button, a, div').withText(new RegExp(buttonText, 'i')).filterVisible();
            if (await anyButton.exists) {
                await t.click(anyButton.nth(0));
            } else {
                console.log(`⚠️ Button "${buttonText}" not found`);
            }
        }
    }
    await waitForApiCall(1000);
}

/**
 * Verify element exists
 */
export async function verifyElementExists(selector: string | Selector, description: string) {
    const element = typeof selector === 'string' ? Selector(selector) : selector;
    await t.expect(element.exists).ok(description);
}

/**
 * Verify text content
 */
export async function verifyTextContent(text: string, description: string) {
    const element = Selector('*').withText(text).filterVisible();
    await t.expect(element.exists).ok(description);
}
