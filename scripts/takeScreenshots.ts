const fs1 = require('fs');
const path1 = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const Jimp = require('jimp');

const screenshotDir = "src/screenshots/"
const publicScreenshotDir = "public/screenshots/"
const searchjunct_logo = "public/og_logo_wide.png";


function getScreenshotOutputPath(url) {
    const root = "https://searchjunct.com/"
    if (url === root) {
        return `${publicScreenshotDir}home.png`
    }
    const url_trimmed = url.replace(root, "")
    const outputPath = `${screenshotDir}${url_trimmed.replace(/[^a-zA-Z0-9\-]/g, "-")}.png`;
    return outputPath
}

async function captureScreenshots(urls) {
    const browser = await puppeteer.launch();
    for (const url of urls) {
        const outputPath = getScreenshotOutputPath(url);
        const outputPathCropped = outputPath.replace('.png', '_crop.png');

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.setViewport({ width: 1200, height: 630 });

        if (outputPath.endsWith('home.png')) {
            await page.screenshot({ path: outputPath });
            console.log(`  - url: ${url}\n  - file: ${outputPath}`);

        }
        await browser.close();
    }
}

console.log(' - Capturing homepage...')
captureScreenshots(["https://searchjunct.com/"]);