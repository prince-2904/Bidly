import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as cheerio from 'cheerio';
import { INITIAL_COUNTRIES, INITIAL_PRODUCTS, INITIAL_ACTIVITIES } from './src/data/initialData';
import { CountryMarket, Product, LiveActivityItem, BidRecord, ScrapedMetadata } from './src/types';

// In-memory runtime database for live interactive bidding
let countryMarkets: CountryMarket[] = JSON.parse(JSON.stringify(INITIAL_COUNTRIES));
let products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let activities: LiveActivityItem[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

function calculateGlobalProductRanks() {
  products.forEach(prod => {
    const owned = countryMarkets.filter(c => c.currentWinnerProductId === prod.id);
    prod.wonCountries = owned.map(c => c.id);
    prod.territories = owned.map(c => ({
      countryId: c.id,
      countryName: c.name,
      countryFlag: c.flag,
      bidAmount: c.currentBid,
      rank: 1,
      wonAt: c.lastBidAt || 'Recent'
    }));
    prod.totalGlobalBid = owned.reduce((sum, c) => sum + c.currentBid, 0);
  });
}

calculateGlobalProductRanks();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Real Metadata Scraper API
  const scrapeHandler = async (req: express.Request, res: express.Response) => {
    try {
      let { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Ensure scheme
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      const domain = parsedUrl.hostname.replace(/^www\./, '');
      const domainNameParts = domain.split('.');
      const rawName = domainNameParts[0];
      const fallbackName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      // Known top tech products heuristics for instant real details
      const KNOWN_DOMAINS: Record<string, { name: string; description: string; logo?: string }> = {
        'github.com': { name: 'GitHub', description: 'The global home for developer collaboration, code hosting, CI/CD, and open source projects.' },
        'stripe.com': { name: 'Stripe', description: 'Financial infrastructure platform powering internet commerce, global payments, and subscription billing.' },
        'linear.app': { name: 'Linear', description: 'The purposeful tool for modern software development. Streamline issues, projects, and product roadmaps.' },
        'notion.so': { name: 'Notion', description: 'Connected workspace for wiki, docs, project management, and AI-powered notes.' },
        'figma.com': { name: 'Figma', description: 'Collaborative cloud interface design and interactive prototyping tool for product teams.' },
        'supabase.com': { name: 'Supabase', description: 'The open source Firebase alternative. Build with Postgres database, Authentication, and realtime APIs.' },
        'vercel.com': { name: 'Vercel', description: 'Frontend cloud platform combining developer experience with edge delivery for modern web apps.' },
        'openai.com': { name: 'OpenAI', description: 'Pioneering artificial intelligence research and deployment platform creator of ChatGPT and GPT-4o.' },
        'cursor.com': { name: 'Cursor', description: 'The AI-first Code Editor built for software engineers to build software faster.' },
        'slack.com': { name: 'Slack', description: 'Productivity platform transforming team collaboration, messaging, and workplace automation.' },
        'discord.com': { name: 'Discord', description: 'Voice, video, and text communication service used by communities and developers worldwide.' },
        'canva.com': { name: 'Canva', description: 'Visual design and communication platform making design simple for everyone.' },
        'postman.com': { name: 'Postman', description: 'Comprehensive API platform for building, testing, documenting, and collaborating on APIs.' }
      };

      let title = '';
      let description = '';
      let ogTitle = '';
      let ogDescription = '';
      let ogImage = '';
      let favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      let logo = '';
      let themeColor = '#2563eb';

      if (KNOWN_DOMAINS[domain]) {
        title = KNOWN_DOMAINS[domain].name;
        description = KNOWN_DOMAINS[domain].description;
      }

      try {
        // Fetch web page with timeout and bot user agent
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (WBW-Bot/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();
          const $ = cheerio.load(html);

          const pageTitle = $('title').first().text().trim() || $('meta[name="title"]').attr('content')?.trim() || '';
          if (pageTitle) title = pageTitle;
          const pageDesc = $('meta[name="description"]').attr('content')?.trim() || '';
          if (pageDesc) description = pageDesc;
          ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || $('meta[name="twitter:title"]').attr('content')?.trim() || '';
          ogDescription = $('meta[property="og:description"]').attr('content')?.trim() || $('meta[name="twitter:description"]').attr('content')?.trim() || '';
          ogImage = $('meta[property="og:image"]').attr('content')?.trim() || $('meta[name="twitter:image"]').attr('content')?.trim() || '';

          const metaTheme = $('meta[name="theme-color"]').attr('content')?.trim();
          if (metaTheme) themeColor = metaTheme;

          // Resolve relative ogImage
          if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
            try {
              ogImage = new URL(ogImage, url).href;
            } catch {
              // ignore
            }
          }

          // Search for apple-touch-icon or explicit high-res icon
          const explicitIcon = $('link[rel="apple-touch-icon"]').attr('href') ||
                               $('link[rel="icon"][sizes="192x192"]').attr('href') ||
                               $('link[rel="icon"][sizes="32x32"]').attr('href') ||
                               $('link[rel="shortcut icon"]').attr('href') ||
                               $('link[rel="icon"]').attr('href');

          if (explicitIcon) {
            try {
              favicon = new URL(explicitIcon, url).href;
            } catch {
              // fallback remains google favicon
            }
          }
        }
      } catch (scrapeErr) {
        console.warn('Direct scraping warning, utilizing domain metadata fallback:', scrapeErr);
      }

      // Cleanup & Fallbacks
      const resolvedTitle = ogTitle || title || KNOWN_DOMAINS[domain]?.name || fallbackName;
      let cleanedTitle = resolvedTitle;
      if (cleanedTitle.includes('|')) cleanedTitle = cleanedTitle.split('|')[0].trim();
      if (cleanedTitle.includes('—')) cleanedTitle = cleanedTitle.split('—')[0].trim();
      if (cleanedTitle.includes(' - ')) cleanedTitle = cleanedTitle.split(' - ')[0].trim();
      if (cleanedTitle.includes(': ')) cleanedTitle = cleanedTitle.split(': ')[0].trim();

      const extractedName = (cleanedTitle.length > 25 || cleanedTitle.length < 2) ? (KNOWN_DOMAINS[domain]?.name || fallbackName) : cleanedTitle;
      const finalDescription = ogDescription || description || KNOWN_DOMAINS[domain]?.description || `${extractedName} — high-performance platform engineered for seamless productivity and global impact.`;

      // Select best logo (high-res google favicon or clearbit or explicit favicon)
      logo = ogImage || favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

      const metadata: ScrapedMetadata = {
        url,
        domain,
        title: resolvedTitle,
        description: finalDescription,
        ogTitle,
        ogDescription,
        ogImage,
        favicon,
        logo: favicon,
        themeColor,
        extractedName,
      };

      res.json(metadata);
    } catch (err: any) {
      console.error('Scraping error:', err);
      res.status(500).json({ error: 'Failed to extract metadata' });
    }
  };

  app.post('/api/scrape-metadata', scrapeHandler);
  app.post('/api/scrape', scrapeHandler);

  // Real-time visitor tracking (Actual active online users)
  const activeVisitors = new Map<string, number>();

  function getRealtimeVisitorCount(): number {
    const now = Date.now();
    // Prune entries older than 2 minutes
    for (const [id, lastSeen] of activeVisitors.entries()) {
      if (now - lastSeen > 120000) {
        activeVisitors.delete(id);
      }
    }
    // Return actual real active visitors
    return Math.max(1, activeVisitors.size);
  }

  // Live Visitor Heartbeat & Count
  app.post('/api/visitors/heartbeat', (req, res) => {
    const visitorId = req.body.visitorId || req.ip || ('anon-' + Math.random().toString(36).substring(2, 8));
    activeVisitors.set(String(visitorId), Date.now());
    const count = getRealtimeVisitorCount();
    res.json({ count, activeSessions: activeVisitors.size, timestamp: Date.now() });
  });

  app.get('/api/visitors/count', (req, res) => {
    const count = getRealtimeVisitorCount();
    res.json({ count, activeSessions: activeVisitors.size, timestamp: Date.now() });
  });

  // Get all Country Markets
  app.get('/api/countries', (req, res) => {
    res.json(countryMarkets);
  });

  // Get single Country Market
  app.get('/api/countries/:id', (req, res) => {
    const id = req.params.id.toUpperCase();
    const market = countryMarkets.find(c => c.id === id);
    if (!market) {
      return res.status(404).json({ error: 'Country market not found' });
    }
    res.json(market);
  });

  // Get all Products
  app.get('/api/products', (req, res) => {
    calculateGlobalProductRanks();
    // Sort by global bid desc
    const sorted = [...products].sort((a, b) => b.totalGlobalBid - a.totalGlobalBid);
    res.json(sorted);
  });

  // Get single Product
  app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    calculateGlobalProductRanks();
    const product = products.find(p => p.id === id || p.slug === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // Create or Update Product
  app.post('/api/products', (req, res) => {
    try {
      const { name, url, tagline, description, logoUrl, ogImage, domain, ownerName, ownerEmail, category } = req.body;
      if (!name || !url) {
        return res.status(400).json({ error: 'Name and URL are required' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = products.find(p => p.domain === domain || p.slug === slug);

      let product: Product;
      if (existing) {
        existing.name = name;
        existing.tagline = tagline || existing.tagline;
        existing.description = description || existing.description;
        existing.logoUrl = logoUrl || existing.logoUrl;
        if (ogImage) existing.ogImage = ogImage;
        if (ownerName) existing.ownerName = ownerName;
        if (ownerEmail) existing.ownerEmail = ownerEmail;
        product = existing;
      } else {
        product = {
          id: 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
          name,
          slug,
          domain: domain || new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace(/^www\./, ''),
          url: url.startsWith('http') ? url : 'https://' + url,
          tagline: tagline || `${name} — Next generation software tool`,
          description: description || `${name} is engineered to deliver high performance and exceptional digital experiences.`,
          logoUrl: logoUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          ogImage: ogImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          ownerName: ownerName || 'Verified Maker',
          ownerEmail: ownerEmail || '',
          createdAt: new Date().toISOString().split('T')[0],
          totalGlobalBid: 0,
          wonCountries: [],
          territories: [],
          category: category || 'Web & AI Tool',
          upvotes: 1
        };
        products.push(product);

        // Add to live activity
        activities.unshift({
          id: 'act-' + Date.now().toString(36),
          type: 'new_listing',
          productId: product.id,
          productName: product.name,
          productLogo: product.logoUrl,
          countryId: 'GLOBAL',
          countryName: 'Worldwide',
          countryFlag: '🌐',
          amount: 1,
          text: `${product.name} joined the World Bids War arena! Ready for global territory battle.`,
          timestamp: 'Just now'
        });
      }

      res.json(product);
    } catch (err) {
      console.error('Error saving product:', err);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Bidding & Battlefield Acquisition Engine
  app.post('/api/bids/create', (req, res) => {
    try {
      const {
        productId,
        productName,
        productDomain,
        productUrl,
        productLogo,
        productTagline,
        productDescription,
        selectedCountries,
        bidderName,
        bidderEmail,
        paymentMethod,
        currency
      } = req.body;

      if (!productId && !productName) {
        return res.status(400).json({ error: 'Product is required' });
      }
      if (!selectedCountries || !Array.isArray(selectedCountries) || selectedCountries.length === 0) {
        return res.status(400).json({ error: 'At least one country battlefield must be selected' });
      }

      // Find or create product
      let product = products.find(p => p.id === productId || (productDomain && p.domain === productDomain));
      if (!product) {
        const slug = (productName || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        product = {
          id: productId || 'prod-' + Date.now().toString(36),
          name: productName || 'Untitled Product',
          slug,
          domain: productDomain || 'example.com',
          url: productUrl || 'https://example.com',
          tagline: productTagline || `${productName} — Digital Innovation`,
          description: productDescription || '',
          logoUrl: productLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
          ownerName: bidderName || 'Maker',
          ownerEmail: bidderEmail || '',
          createdAt: new Date().toISOString().split('T')[0],
          totalGlobalBid: 0,
          wonCountries: [],
          territories: []
        };
        products.push(product);
      }

      const results = [];
      const nowStr = 'Just now';

      for (const selection of selectedCountries) {
        const country = countryMarkets.find(c => c.id === selection.countryId);
        if (!country) continue;

        const bidAmount = Number(selection.bidAmount);
        if (isNaN(bidAmount) || bidAmount < country.minNextBid) {
          continue;
        }

        const isDisplacing = country.currentWinnerProductId && country.currentWinnerProductId !== product.id;
        const previousWinnerName = country.currentWinnerProductName;
        const previousBid = country.currentBid;

        const txHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        const newBidRecord: BidRecord = {
          id: 'bid-' + Date.now() + '-' + country.id,
          productId: product.id,
          productName: product.name,
          productLogo: product.logoUrl,
          productUrl: product.url,
          countryId: country.id,
          countryName: country.name,
          countryFlag: country.flag,
          amount: bidAmount,
          bidderName: bidderName || product.ownerName || 'Verified Maker',
          bidderEmail: bidderEmail || product.ownerEmail,
          timestamp: nowStr,
          txHash,
          status: 'active'
        };

        // Mark previous active bids in country as outbid
        country.bidsHistory.forEach(b => {
          if (b.status === 'active') b.status = 'outbid';
        });
        country.bidsHistory.unshift(newBidRecord);

        // Update country market
        country.currentWinnerProductId = product.id;
        country.currentWinnerProductName = product.name;
        country.currentWinnerProductLogo = product.logoUrl;
        country.currentWinnerProductUrl = product.url;
        country.currentWinnerTagline = product.tagline;
        country.currentBid = bidAmount;
        country.minNextBid = bidAmount + 1;
        country.totalBidsCount += 1;
        country.biddersCount = new Set(country.bidsHistory.map(b => b.bidderName)).size;
        country.lastBidAt = nowStr;
        country.heatLevel = country.totalBidsCount >= 10 ? 'high' : country.totalBidsCount >= 4 ? 'medium' : 'low';

        // Update active contenders
        const existingContenderIndex = country.activeContenders.findIndex(ac => ac.productId === product!.id);
        if (existingContenderIndex >= 0) {
          country.activeContenders[existingContenderIndex].bidAmount = bidAmount;
          country.activeContenders[existingContenderIndex].bidAt = nowStr;
        } else {
          country.activeContenders.unshift({
            productId: product.id,
            productName: product.name,
            productLogo: product.logoUrl,
            productUrl: product.url,
            bidAmount,
            bidAt: nowStr
          });
        }
        country.activeContenders.sort((a, b) => b.bidAmount - a.bidAmount);

        // Create Activity Item
        const activityText = isDisplacing
          ? `${product.name} outbid ${previousWinnerName} (${previousBid}) to become #1 in ${country.name} at ${bidAmount}!`
          : `${product.name} took top placement in ${country.name} with a ${bidAmount} bid!`;

        activities.unshift({
          id: 'act-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
          type: isDisplacing ? 'outbid' : 'new_bid',
          productId: product.id,
          productName: product.name,
          productLogo: product.logoUrl,
          countryId: country.id,
          countryName: country.name,
          countryFlag: country.flag,
          amount: bidAmount,
          text: activityText,
          timestamp: nowStr,
          fromCountryId: 'GLOBAL'
        });

        results.push({
          countryId: country.id,
          countryName: country.name,
          countryFlag: country.flag,
          bidAmount,
          txHash,
          isWinner: true
        });
      }

      // Recalculate ranks and global totals
      calculateGlobalProductRanks();

      // Trim activities to latest 50
      if (activities.length > 50) {
        activities = activities.slice(0, 50);
      }

      res.json({
        success: true,
        product,
        claimedTerritories: results,
        paymentDetails: {
          method: paymentMethod || 'stripe',
          currency: currency || 'USD',
          totalPaid: results.reduce((sum, r) => sum + r.bidAmount, 0),
          receiptId: 'WBW-TX-' + Date.now().toString(36).toUpperCase()
        }
      });
    } catch (err) {
      console.error('Error placing bid:', err);
      res.status(500).json({ error: 'Failed to process territory bid' });
    }
  });

  // Global Leaderboard API
  app.get('/api/leaderboard', (req, res) => {
    calculateGlobalProductRanks();
    const sorted = [...products].sort((a, b) => {
      if (b.wonCountries.length !== a.wonCountries.length) {
        return b.wonCountries.length - a.wonCountries.length;
      }
      return b.totalGlobalBid - a.totalGlobalBid;
    });

    const ranked = sorted.map((p, idx) => ({
      rank: idx + 1,
      ...p,
      countriesCount: p.wonCountries.length,
      isLeader: idx === 0
    }));

    res.json(ranked);
  });

  // Live Activity Feed API
  app.get('/api/activity', (req, res) => {
    res.json(activities.slice(0, 25));
  });

  // Global Analytics & War Stats
  app.get('/api/stats', (req, res) => {
    const totalVolume = countryMarkets.reduce((acc, c) => acc + c.currentBid, 0);
    const activeTerritories = countryMarkets.filter(c => c.currentWinnerProductId !== null).length;
    const totalBidsEver = countryMarkets.reduce((acc, c) => acc + c.totalBidsCount, 0);
    const topContested = [...countryMarkets].sort((a, b) => b.totalBidsCount - a.totalBidsCount).slice(0, 5);

    res.json({
      totalVolume,
      activeTerritories,
      totalCountries: countryMarkets.length,
      totalBidsEver,
      totalRegisteredProducts: products.length,
      topContested
    });
  });

  // Vite Middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WBW — World Bids War server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
