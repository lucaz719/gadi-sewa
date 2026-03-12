module.exports = {
    src: './tests/**/*.test.ts',
    browsers: ['chrome:headless'],
    screenshots: {
        path: 'tests/screenshots/',
        takeOnFails: true,
        fullPage: true
    },
    baseUrl: 'http://localhost:5173',
    skipJsErrors: true,
    quarantineMode: false,
    stopOnFirstFail: false,
    concurrency: 1,
    assertionTimeout: 5000,
    pageLoadTimeout: 10000,
    speed: 1,
    reporter: [
        {
            name: 'spec'
        },
        {
            name: 'json',
            output: 'tests/reports/report.json'
        }
    ]
};
