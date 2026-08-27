// api/products/preview.cjs

// 'got' ko CJS style mein require karein
const got = require('got');

// Metascraper ko require karein
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
]);

// 'export default' ki jagah 'module.exports' use karein
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Check for body existence before destructuring
  if (!req.body) {
    return res.status(400).json({ success: false, error: 'Request body is missing.' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  try {
    const { body: html, url: targetUrl } = await got(url, { timeout: { request: 8000 }}); // Timeout thoda badha diya
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
    console.error(`Error fetching metadata for ${url}:`, error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch product metadata.' });
  }
}
