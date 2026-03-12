import { Selector } from 'testcafe';

fixture('Dashboard')
    .page('http://localhost:5173/')
    .beforeEach(async t => {
        await t.wait(2000);
    });

test('Should display dashboard with statistics', async t => {
    // Check for main heading
    const heading = Selector('h1, h2').withText(/dashboard|welcome/i);
    await t.expect(heading.exists).ok('Dashboard should be visible');

    // Check for stat cards
    const statCards = Selector('[class*="stat"], [class*="card"]');
    const cardCount = await statCards.count;
    await t.expect(cardCount).gte(1, 'Dashboard should display statistics');
});

test('Should navigate to different sections', async t => {
    // Test navigation links
    const links = [
        { text: /inventory/i, url: '/inventory' },
        { text: /jobs/i, url: '/jobs' },
        { text: /pos/i, url: '/pos' }
    ];

    for (const link of links) {
        const navLink = Selector('a').withText(link.text);
        if (await navLink.exists) {
            await t
                .click(navLink)
                .wait(1000);

            // Verify URL changed
            const currentUrl = await t.eval(() => window.location.pathname);
            await t.expect(currentUrl).contains(link.url, `Should navigate to ${link.url}`);

            // Navigate back to dashboard
            const dashboardLink = Selector('a').withAttribute('href', '/');
            if (await dashboardLink.exists) {
                await t.click(dashboardLink).wait(1000);
            }
        }
    }
});

test('Should display charts', async t => {
    // Check for chart elements (Recharts renders SVG)
    const charts = Selector('svg, canvas, [class*="chart"]');
    const chartCount = await charts.count;
    await t.expect(chartCount).gte(1, 'Dashboard should display charts');
});

test('Should close onboarding modal if present', async t => {
    // Check if onboarding modal exists
    const modal = Selector('[class*="modal"], [role="dialog"]');
    if (await modal.exists) {
        const closeButton = Selector('button').withText(/get started|close/i);
        if (await closeButton.exists) {
            await t.click(closeButton).wait(500);
            await t.expect(modal.exists).notOk('Modal should be closed');
        }
    }
});
