import puppeteer from 'puppeteer';

describe('Immediately initiate URL-driven search', () => {
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

    it('should confirm that localStorage initiateSearchImmediately is either null or false', async () => {
        const initiateSearchImmediately = await page.evaluate(() => localStorage.getItem('initiateSearchImmediately'));
        expect(initiateSearchImmediately).toBe(null || 'false');
    });

    it('should confirm that opening a URL with a query parameter in the default mode does not launch a new tab', async () => {
        const startPageLength = (await browser.pages()).length;
        const newPage = await browser.newPage();
        await newPage.goto('http://localhost:3000/?q=test+query');
        const pages = await browser.pages();
        expect(pages.length).toBe(startPageLength + 1);
        await newPage.close();
    });

    it('should confirm that the toggle switch updates localStorage initiateSearchImmediately and reflects the correct status', async () => {
        await page.click('#settings-button');
        await page.waitForSelector('#settings-modal');
        await page.click('#initiate-search-immediately');
        const initiateSearchImmediately = await page.evaluate(() => localStorage.getItem('initiateSearchImmediately'));
        expect(initiateSearchImmediately).toBe('true');
        const statusText = await page.$eval('#initiate-search-immediately-status', (el: HTMLElement) => el.textContent);
        expect(statusText).toMatch(/Enabled/);
        await page.click('body'); // Click outside the modal to close it
    });

    it('should open a new page and confirm that a new tab opens with a query parameter', async () => {
        const startPageLength = (await browser.pages()).length;
        const newPage = await browser.newPage();
        await newPage.goto('http://localhost:3000/?q=test+query');
        const pages = await browser.pages();
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
        const allUrls = await Promise.all(pages.map(async (page) => await page.url()));
        console.log("All URLs:", allUrls);
        expect(pages.length).toBe(startPageLength + 2);
        await newPage.close();
    });
});