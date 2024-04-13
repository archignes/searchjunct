import puppeteer from 'puppeteer';

describe('System List', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;


    beforeAll(async () => {
        jest.setTimeout(20000); // Set timeout to 20 seconds
        console.log('Launching browser');
        browser = await puppeteer.launch({ headless: false });
        console.log('Opening new page');
        page = await browser.newPage();
    });

    afterAll(async () => {
        console.log('Closing browser');
        await browser.close();
    });

    it('should scroll to the bottom of the system list and verify the presence of system buttons', async () => {
        try {
             console.log('Navigating to the home page');
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 5000 });

        // Wait for the system list to be present
        console.log('Waiting for the system list to be present');
        try {
            await page.waitForSelector('#systems-list', { timeout: 3000 });
            console.log('System list found successfully');
        } catch (error) {
            console.error('Failed to find system list:', error);
        }

        // Scroll the first element of the system list to the bottom
        console.log('Scrolling the first element of the system list to the bottom');
        await page.evaluate(() => {
            const systemList = document.querySelector('#systems-list');
            if (systemList && systemList.firstElementChild) {
                systemList.firstElementChild.scrollTop = systemList.firstElementChild.scrollHeight;
            }
        const lastElement = systemList!.lastElementChild;
        console.log('Element at the bottom:', lastElement);
        });

        // Wait for the system list to update after scrolling
        console.log('Waiting for the system list to update after scrolling');
        await new Promise(r => setTimeout(r, 3000))

        const systemsData = require('../src/data/systems.json');
        const numberOfSystems = systemsData.length;
        
        // Check if any system buttons exist
        console.log('Checking for the presence of the link text at the bottom of the list');
        const bottomOfListText = await page.$eval('[data-testid^="bottom-of-list-number-of-systems"]', el => el.textContent);
        console.log('Bottom of list text:', bottomOfListText);
        expect(bottomOfListText).toEqual(`Showing ${numberOfSystems} of ${numberOfSystems} systems`);

        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }, 10000);
});

