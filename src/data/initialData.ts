import { CountryMarket, Product, LiveActivityItem } from '../types';
import { COUNTRIES_195_RAW } from './countries195';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-apives',
    name: 'Apives',
    slug: 'apives',
    domain: 'apives.com',
    url: 'https://apives.com',
    tagline: 'Modern API management and developer gateway infrastructure',
    description: 'High-performance API platform for building, securing, monitoring, and scaling distributed cloud APIs.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=apives.com&sz=128',
    ownerName: 'Apives Team',
    ownerEmail: 'team@apives.com',
    createdAt: '1 day ago',
    totalGlobalBid: 2,
    wonCountries: ['US'],
    territories: [
      { countryId: 'US', countryName: 'United States', countryFlag: '🇺🇸', bidAmount: 2, rank: 1, wonAt: 'Just now' }
    ],
    category: 'Developer Tools',
    upvotes: 42,
  },
  {
    id: 'prod-startives',
    name: 'Startives',
    slug: 'startives',
    domain: 'startives.com',
    url: 'https://startives.com',
    tagline: 'Launch and scale your startup with intelligent founder tools',
    description: 'All-in-one execution stack for high-growth founders and agile startup teams to build and ship fast.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=startives.com&sz=128',
    ownerName: 'Startives Team',
    ownerEmail: 'team@startives.com',
    createdAt: '2 days ago',
    totalGlobalBid: 2,
    wonCountries: ['IN'],
    territories: [
      { countryId: 'IN', countryName: 'India', countryFlag: '🇮🇳', bidAmount: 2, rank: 1, wonAt: '10 mins ago' }
    ],
    category: 'Productivity',
    upvotes: 38,
  },
  {
    id: 'prod-fakemayo',
    name: 'Fake Mayo',
    slug: 'fakemayo',
    domain: 'fakemayo.com',
    url: 'https://fakemayo.com',
    tagline: 'Creative digital experiences and experimental web design',
    description: 'Modern interactive design studio crafting playful digital products, interactive interfaces, and micro-tools.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=fakemayo.com&sz=128',
    ownerName: 'Fake Mayo Studio',
    ownerEmail: 'hello@fakemayo.com',
    createdAt: '2 days ago',
    totalGlobalBid: 1,
    wonCountries: ['JP'],
    territories: [
      { countryId: 'JP', countryName: 'Japan', countryFlag: '🇯🇵', bidAmount: 1, rank: 1, wonAt: '25 mins ago' }
    ],
    category: 'Design',
    upvotes: 29,
  },
  {
    id: 'prod-limeboost',
    name: 'Limeboost',
    slug: 'limeboost',
    domain: 'limeboost.io',
    url: 'https://limeboost.io/app/',
    tagline: 'Supercharge productivity and team acceleration workflows',
    description: 'Smart workspace assistant designed to automate repetitive task flows and speed up team execution.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=limeboost.io&sz=128',
    ownerName: 'Limeboost Team',
    ownerEmail: 'team@limeboost.io',
    createdAt: '3 days ago',
    totalGlobalBid: 1,
    wonCountries: ['FR'],
    territories: [
      { countryId: 'FR', countryName: 'France', countryFlag: '🇫🇷', bidAmount: 1, rank: 1, wonAt: '35 mins ago' }
    ],
    category: 'Productivity',
    upvotes: 24,
  },
  {
    id: 'prod-planivum',
    name: 'Planivum',
    slug: 'planivum',
    domain: 'planivum.com',
    url: 'https://www.planivum.com/waitlist',
    tagline: 'Next-generation strategic roadmapping and project planning',
    description: 'Visual alignment platform for product leaders and agile teams to track milestones and deliverables.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=planivum.com&sz=128',
    ownerName: 'Planivum Team',
    ownerEmail: 'contact@planivum.com',
    createdAt: '3 days ago',
    totalGlobalBid: 1,
    wonCountries: ['CH'],
    territories: [
      { countryId: 'CH', countryName: 'Switzerland', countryFlag: '🇨🇭', bidAmount: 1, rank: 1, wonAt: '45 mins ago' }
    ],
    category: 'Productivity',
    upvotes: 21,
  },
  {
    id: 'prod-abetai',
    name: 'Abet AI',
    slug: 'abetai',
    domain: 'abetai.co',
    url: 'https://www.abetai.co/',
    tagline: 'Autonomous AI copilot for intelligent operational decision making',
    description: 'Enterprise generative AI agents engineered for speed, accuracy, and automated workflow execution.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=abetai.co&sz=128',
    ownerName: 'Abet AI Team',
    ownerEmail: 'founders@abetai.co',
    createdAt: '4 days ago',
    totalGlobalBid: 1,
    wonCountries: ['BR'],
    territories: [
      { countryId: 'BR', countryName: 'Brazil', countryFlag: '🇧🇷', bidAmount: 1, rank: 1, wonAt: '1 hour ago' }
    ],
    category: 'Artificial Intelligence',
    upvotes: 19,
  },
  {
    id: 'prod-optionsbell',
    name: 'Optionsbell',
    slug: 'optionsbell',
    domain: 'optionsbell.com',
    url: 'https://optionsbell.com/',
    tagline: 'Smart options trading analysis and real-time market insights',
    description: 'Advanced options trading intelligence, volatility analytics, and real-time alert platform for modern traders and investors.',
    logoUrl: 'https://www.google.com/s2/favicons?domain=optionsbell.com&sz=128',
    ownerName: 'Optionsbell Team',
    ownerEmail: 'contact@optionsbell.com',
    createdAt: '4 days ago',
    totalGlobalBid: 1,
    wonCountries: ['AR'],
    territories: [
      { countryId: 'AR', countryName: 'Argentina', countryFlag: '🇦🇷', bidAmount: 1, rank: 1, wonAt: '1 hour ago' }
    ],
    category: 'Finance',
    upvotes: 16,
  }
];

// Map of initial winning bids (Exactly 7 claimed territories)
const PRESET_CLAIMS: Record<string, {
  prodId: string;
  bid: number;
  lastBidAt: string;
  totalBids: number;
  bidders: number;
  heat: 'low' | 'medium' | 'high';
}> = {
  US: { prodId: 'prod-apives', bid: 2, lastBidAt: 'Just now', totalBids: 1, bidders: 1, heat: 'high' },
  IN: { prodId: 'prod-startives', bid: 2, lastBidAt: '10 mins ago', totalBids: 1, bidders: 1, heat: 'high' },
  JP: { prodId: 'prod-fakemayo', bid: 1, lastBidAt: '25 mins ago', totalBids: 1, bidders: 1, heat: 'medium' },
  FR: { prodId: 'prod-limeboost', bid: 1, lastBidAt: '35 mins ago', totalBids: 1, bidders: 1, heat: 'medium' },
  CH: { prodId: 'prod-planivum', bid: 1, lastBidAt: '45 mins ago', totalBids: 1, bidders: 1, heat: 'medium' },
  BR: { prodId: 'prod-abetai', bid: 1, lastBidAt: '1 hour ago', totalBids: 1, bidders: 1, heat: 'low' },
  AR: { prodId: 'prod-optionsbell', bid: 1, lastBidAt: '1 hour ago', totalBids: 1, bidders: 1, heat: 'low' },
};

// Build all 195 recognized sovereign countries (193 UN members + Vatican City + Palestine)
export const INITIAL_COUNTRIES: CountryMarket[] = COUNTRIES_195_RAW.map(c => {
  const claim = PRESET_CLAIMS[c.id];
  if (claim) {
    const prod = INITIAL_PRODUCTS.find(p => p.id === claim.prodId)!;
    return {
      id: c.id,
      name: c.name,
      code: c.code,
      flag: c.flag,
      lat: c.lat,
      lng: c.lng,
      continent: c.continent,
      currentWinnerProductId: prod.id,
      currentWinnerProductName: prod.name,
      currentWinnerProductLogo: prod.logoUrl,
      currentWinnerProductUrl: prod.url,
      currentWinnerTagline: prod.tagline,
      currentBid: claim.bid,
      minNextBid: claim.bid + 1,
      totalBidsCount: 1,
      biddersCount: 1,
      lastBidAt: claim.lastBidAt,
      heatLevel: claim.heat,
      bidsHistory: [
        {
          id: `bid-${c.id.toLowerCase()}-1`,
          productId: prod.id,
          productName: prod.name,
          productLogo: prod.logoUrl,
          productUrl: prod.url,
          countryId: c.id,
          countryName: c.name,
          countryFlag: c.flag,
          amount: claim.bid,
          bidderName: prod.ownerName,
          timestamp: claim.lastBidAt,
          txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
          status: 'active'
        }
      ],
      activeContenders: [
        {
          productId: prod.id,
          productName: prod.name,
          productLogo: prod.logoUrl,
          productUrl: prod.url,
          bidAmount: claim.bid,
          bidAt: claim.lastBidAt
        }
      ]
    };
  }

  return {
    id: c.id,
    name: c.name,
    code: c.code,
    flag: c.flag,
    lat: c.lat,
    lng: c.lng,
    continent: c.continent,
    currentWinnerProductId: null,
    currentBid: 0,
    minNextBid: 1,
    totalBidsCount: 0,
    biddersCount: 0,
    lastBidAt: 'Unclaimed',
    heatLevel: 'low',
    bidsHistory: [],
    activeContenders: []
  };
});

export const INITIAL_ACTIVITIES: LiveActivityItem[] = [
  {
    id: 'act-1',
    type: 'new_bid',
    productId: 'prod-apives',
    productName: 'Apives',
    productLogo: 'https://www.google.com/s2/favicons?domain=apives.com&sz=128',
    countryId: 'US',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    amount: 2,
    text: 'Apives claimed #1 territory position in United States ($2)',
    timestamp: 'Just now',
    fromCountryId: 'US',
  },
  {
    id: 'act-2',
    type: 'new_bid',
    productId: 'prod-startives',
    productName: 'Startives',
    productLogo: 'https://www.google.com/s2/favicons?domain=startives.com&sz=128',
    countryId: 'IN',
    countryName: 'India',
    countryFlag: '🇮🇳',
    amount: 2,
    text: 'Startives took top position over India with a $2 bid',
    timestamp: '10 mins ago',
    fromCountryId: 'IN',
  },
  {
    id: 'act-3',
    type: 'new_bid',
    productId: 'prod-fakemayo',
    productName: 'Fake Mayo',
    productLogo: 'https://www.google.com/s2/favicons?domain=fakemayo.com&sz=128',
    countryId: 'JP',
    countryName: 'Japan',
    countryFlag: '🇯🇵',
    amount: 1,
    text: 'Fake Mayo secured Japan territory position at $1',
    timestamp: '25 mins ago',
    fromCountryId: 'JP',
  },
  {
    id: 'act-4',
    type: 'new_bid',
    productId: 'prod-limeboost',
    productName: 'Limeboost',
    productLogo: 'https://www.google.com/s2/favicons?domain=limeboost.io&sz=128',
    countryId: 'FR',
    countryName: 'France',
    countryFlag: '🇫🇷',
    amount: 1,
    text: 'Limeboost entered France with $1 top bid',
    timestamp: '35 mins ago',
    fromCountryId: 'FR',
  },
  {
    id: 'act-5',
    type: 'new_bid',
    productId: 'prod-planivum',
    productName: 'Planivum',
    productLogo: 'https://www.google.com/s2/favicons?domain=planivum.com&sz=128',
    countryId: 'CH',
    countryName: 'Switzerland',
    countryFlag: '🇨🇭',
    amount: 1,
    text: 'Planivum claimed Switzerland marketplace at $1',
    timestamp: '45 mins ago',
    fromCountryId: 'CH',
  },
  {
    id: 'act-6',
    type: 'new_bid',
    productId: 'prod-abetai',
    productName: 'Abet AI',
    productLogo: 'https://www.google.com/s2/favicons?domain=abetai.co&sz=128',
    countryId: 'BR',
    countryName: 'Brazil',
    countryFlag: '🇧🇷',
    amount: 1,
    text: 'Abet AI claimed Brazil with $1 winning bid',
    timestamp: '1 hour ago',
    fromCountryId: 'BR',
  },
  {
    id: 'act-7',
    type: 'new_bid',
    productId: 'prod-optionsbell',
    productName: 'Optionsbell',
    productLogo: 'https://www.google.com/s2/favicons?domain=optionsbell.com&sz=128',
    countryId: 'AR',
    countryName: 'Argentina',
    countryFlag: '🇦🇷',
    amount: 1,
    text: 'Optionsbell secured Argentina territory position at $1',
    timestamp: '1 hour ago',
    fromCountryId: 'AR',
  }
];
