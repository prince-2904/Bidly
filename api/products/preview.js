// File: api/products/preview.js

// Using require for CJS environment
const got = require('got');
const metascraper = require('metascraper')([
    require('metascraper-description')(),
    require('metascraper-image')(),
    require('metascraper-logo')(),
    require('metascraper-publisher')(),
    require('metascraper-title')(),
    require('metascraper-url')(),
]);

// Standard Vercel handler export for CJS
module.exports = async (req, res) => {
    // Handling CORS for preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).send('');
    }

    // Set CORS headers for the actual request
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // Check if body exists
    if (!req.body) {
        return res.status(400).json({ success: false, error: 'Request body is missing.' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    try {
        const { body: html, url: targetUrl } = await got(url, { timeout: { request: 8000 } });
        const metadata = await metascraper({ html, url: targetUrl });

        const productPreview = {
            name: metadata.title || 'Untitled',
            description: metadata.description || '',
            logo: metadata.logo || metadata.image || '',
            url: metadata.url,
            domain: new URL(metadata.url).hostname,
        };

        return res.status(200).json({ success: true, data: productPreview });

    } catch (error) {
        console.error(`[PREVIEW_API_ERROR] URL: ${url}, Error: ${error.message}`);
        return res.status(500).json({ success: false, error: 'Failed to fetch product metadata.' });
    }
};
