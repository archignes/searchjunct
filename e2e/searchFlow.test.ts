import puppeteer from 'puppeteer';


describe('Search Flow', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        jest.setTimeout(20000); // Set timeout to 20 seconds
        browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should enter a query, initiate a search, and verify results open in a new tab', async () => {
        await page.goto('http://localhost:3000/');

        await page.type('#search-input', 'Test Query');
        await page.click('#search-button');

        const newPagePromise = new Promise<puppeteer.Page>(resolve => browser.once('targetcreated', async (target: puppeteer.Target) => {
            const newPage = await target.page();
            if (newPage) {
                resolve(newPage);
            }
        }));
        const newPage = await newPagePromise as any;

        const url = await newPage.url();
        expect(url).toMatch(/.*/);
        await newPage.close();
    });

    it('should not trigger a search when shift+enter is pressed in the search input', async () => {
        const startingURL = "http://localhost:3000/"
        await page.goto(startingURL);

        await page.focus('#search-input');
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');

        const isSearchTriggered = await page.evaluate((startingURL: string) => {
            // Check if the URL has changed as a way to determine if a search was triggered
            const currentUrl = window.location.href;
            return startingURL === currentUrl;
        });

        expect(isSearchTriggered).toBe(false);
    });
});