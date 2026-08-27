// api/products/preview.js

// Dynamic import for 'got' as it's an ESM module
const got = (...args) => import('got').then(({ default: got }) => got(...args));

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clear-url')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
]);


export default async function handler(req, res) {
  // Allow CORS for your frontend domain in production
  res.setHeader('Access-Control-Allow-Origin', '*'); // For testing, '*' is fine. For production, use 'https://your-domain.com'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  try {
    const { body: html, url: targetUrl } = await got(url, { timeout: { request: 5000 }});
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
