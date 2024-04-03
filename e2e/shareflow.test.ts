import puppeteer from 'puppeteer';

describe('Share flow test', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        jest.setTimeout(20000); // Set timeout to 20 seconds
        browser = await puppeteer.launch({ headless: false, slowMo: 100 });
        page = await browser.newPage();
        await page.goto('http://localhost:3000/');
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should confirm that clicking the Share button in the toolbar after typing a query shows the query in the URL', async () => {
        await page.type('#search-input', 'test query');
        await page.click('#share-button');
        const url = await page.url();
        expect(url).toMatch(/q=test%20query/);
    });
});