const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
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