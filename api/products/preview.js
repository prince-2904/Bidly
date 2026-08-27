// File: api/products/preview.js
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // CORS Setup
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    if (!req.body || !req.body.url) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    let targetUrl = req.body.url;
    // Add https:// if user didn't type it
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }

    try {
        // Native fetch use kar rahe hain (No 'got' library needed)
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Website returned status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html); // Cheerio se HTML parse kar rahe hain

        // Metadata nikalna
        const name = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Untitled';
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        let logo = $('meta[property="og:image"]').attr('content') || $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';

        // Agar logo ka URL aadha hai (jaise '/logo.png'), to usko poora banana
        if (logo && !logo.startsWith('http')) {
            const urlObj = new URL(targetUrl);
            logo = logo.startsWith('/') ? `${urlObj.origin}${logo}` : `${urlObj.origin}/${logo}`;
        }

        const domain = new URL(targetUrl).hostname;

        const productPreview = {
            name: name.trim(),
            description: description.trim(),
            logo: logo.trim(),
            url: targetUrl,
            domain: domain,
        };

        return res.status(200).json({ success: true, data: productPreview });

    } catch (error) {
        console.error(`Error scraping URL ${targetUrl}:`, error.message);
        return res.status(500).json({ success: false, error: 'Failed to fetch product metadata. Website might be blocking requests.' });
    }
};
