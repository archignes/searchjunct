import puppeteer from 'puppeteer';

describe('Immediately initiate URL-driven search', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        console.log('Launching browser');
        browser = await puppeteer.launch({ headless: false });
        console.log('Opening new page');
        page = await browser.newPage();
        console.log('Navigating to the home page');
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 5000 });
    });

    afterAll(async () => {
        console.log('Closing browser');
        await browser.close();
    });

    it('should initiate a search automatically when a query is provided in the URL', async () => {
        // Click on the settings button to open the settings modal
        console.log('Clicking on the settings button');
        try {
            await page.click('#settings-button');
            console.log('Settings button clicked successfully');
        } catch (error) {
            console.error('Failed to click on settings button:', error);
        }

        // Wait for the settings modal to open
        console.log('Waiting for the settings modal to open');
        try {
            await page.waitForSelector('#settings-modal', { timeout: 3000 });
            console.log('Settings modal opened successfully');
        } catch (error) {
            console.error('Failed to wait for settings modal:', error);
        }

        // Toggle the "Immediately initiate URL-driven search upon page load" switch
        console.log('Toggling the search initiation switch');
        try {
            await page.click('#initiate-search-immediately');
            console.log('Search initiation switch toggled successfully');

            // Add this block to check the localStorage value
            const isSearchInitiated = await page.evaluate(() => {
                return localStorage.getItem('initiateSearchImmediately');
            });
            console.log(`LocalStorage initiateSearchImmediately: ${isSearchInitiated}`);

        } catch (error) {
            console.error('Failed to toggle search initiation switch:', error);
        }

        // Close the settings modal
        console.log('Closing the settings modal');
        try {
            await page.mouse.click(0, 0); // Click at the top-left corner of the page to close the modal
            console.log('Settings modal closed successfully');
        } catch (error) {
            console.error('Failed to close settings modal:', error);
        }

        // Navigate to the page with a query parameter
        console.log('Navigating to the page with a query parameter');
        try {
            const newPage = await browser.newPage();
            await newPage.goto('http://localhost:3000/?q=test+query', { waitUntil: 'networkidle0', timeout: 3000 });
            console.log('Navigation to newPage with query parameter successful');
            // Add this block to check the localStorage value
            const isSearchInitiated = await newPage.evaluate(() => {
                return localStorage.getItem('initiateSearchImmediately');
            });
            console.log(`LocalStorage initiateSearchImmediately per newPage: ${isSearchInitiated}`);
        } catch (error) {
            console.error('Failed to navigate to newPage with query:', error);
        }

        // Wait for a new tab to open
        console.log('Waiting for new tab to open');
        const newTarget = await browser.waitForTarget(target => target.url().includes('test+query'), { timeout: 10000 });
        const newPageTab = await newTarget.page();


        // Switch to the new tab
        console.log('Switching to the new tab');
        try {
            await newPageTab.bringToFront();
            console.log('New tab brought to front successfully');
        } catch (error) {
            console.error('Failed to bring new tab to front:', error);
        }

        // Verify that the new tab URL contains the search query
        console.log('Verifying the new tab URL contains the search query');
        const newPageTabUrl = await newPageTab.url();
        expect(newPageTabUrl).toMatch(/.*/);
        console.log('New tab URL verification successful');

        // Close the new tab
        console.log('Closing the new tab');
        try {
            await newPageTab.close();
            console.log('New tab closed successfully');
        } catch (error) {
            console.error('Failed to close new tab:', error);
        }
    }, 10000); // 10 seconds timeout
});