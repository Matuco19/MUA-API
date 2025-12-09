const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const urlModule = require('url');
const net = require('net');

const isValidURL = (urlString) => {
    try {
        const parsedUrl = new urlModule.URL(urlString);
        const { protocol, hostname } = parsedUrl;
        if (protocol !== 'http:' && protocol !== 'https:') {
            return false;
        }
        // block to IP address hosts
        if (net.isIP(hostname) !== 0) {
            return false;
        }
        // block to local addresses
        if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
};

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }
    if (!isValidURL(url)) {
        return res.status(400).send('Invalid URL provided.');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const width = parseInt(req.query.width, 10) || 1280;
        const height = parseInt(req.query.height, 10) || 720;
        await page.setViewport({ width, height });
        await page.goto(url);
        const screenshot = await page.screenshot();

        await browser.close();
        res.type('image/png').send(screenshot);
    } catch (error) {
        res.status(500).send('Error capturing screenshot');
        console.error("screenshot: ", error)
    }
});

module.exports = router;