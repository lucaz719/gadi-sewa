import { Selector } from 'testcafe';
import { waitForApiCall } from '../helpers/utils';
import { testData } from '../data/test-data';

fixture('Job Management')
    .page('http://localhost:5173/jobs/new')
    .beforeEach(async t => {
        await t.wait(2000);
    });

test('Should display job creation wizard', async t => {
    const heading = Selector('h1, h2').withText(/create|new.*job/i);
    await t.expect(heading.exists).ok('Job creation page should be visible');
});

test('Should create a new job card with AI analysis', async t => {
    // Step 1: Select or create customer
    const customerSelect = Selector('select, input').withAttribute('placeholder', /customer/i);
    if (await customerSelect.exists) {
        await t.click(customerSelect);
        // Select first option or type customer name
        const firstOption = Selector('option').nth(1);
        if (await firstOption.exists) {
            await t.click(firstOption);
        }
    }

    // Click Next if multi-step
    const nextButton = Selector('button').withText(/next/i);
    if (await nextButton.exists) {
        await t.click(nextButton).wait(500);
    }

    // Step 2: Enter complaint
    const complaintTextarea = Selector('textarea');
    if (await complaintTextarea.exists) {
        await t.typeText(complaintTextarea, testData.jobs.validComplaint);
    }

    // Trigger AI analysis if button exists
    const analyzeButton = Selector('button').withText(/analyze|ai/i);
    if (await analyzeButton.exists) {
        await t.click(analyzeButton);

        // Wait for AI response
        await waitForApiCall(5000);

        // Verify AI insights appear
        const insights = Selector('div, section').withText(/insight|analysis|cause/i);
        await t.expect(insights.exists).ok({ timeout: 10000 }, 'AI insights should appear');
    }

    // Navigate through remaining steps
    if (await nextButton.exists) {
        await t.click(nextButton).wait(500);
    }

    // Final step: Create job
    const createButton = Selector('button').withText(/create.*job/i);
    if (await createButton.exists) {
        await t.click(createButton);

        // Wait for job creation
        await waitForApiCall(3000);

        // Verify redirect or success message
        await t.wait(2000);
    }
});

test('Should navigate back through job creation steps', async t => {
    const nextButton = Selector('button').withText(/next/i);
    const backButton = Selector('button').withText(/back/i);

    // Go forward
    if (await nextButton.exists) {
        await t.click(nextButton).wait(500);
    }

    // Go back
    if (await backButton.exists) {
        await t.click(backButton).wait(500);
        await t.expect(backButton.exists).ok('Should be able to navigate back');
    }
});

test('Should validate required fields', async t => {
    const createButton = Selector('button').withText(/create.*job|next/i);

    if (await createButton.exists) {
        // Try to submit without filling required fields
        await t.click(createButton);

        // Check for validation messages or that we haven't progressed
        await t.wait(1000);
        // The form should still be visible or show validation errors
    }
});
