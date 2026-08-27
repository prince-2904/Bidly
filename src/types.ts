export interface CountryMarket {
  id: string; // ISO code like "IN", "US", "GB", "DE", "JP", etc.
  name: string;
  code: string;
  flag: string;
  lat: number;
  lng: number;
  continent: string;
  currentWinnerProductId: string | null;
  currentWinnerProductName?: string;
  currentWinnerProductLogo?: string;
  currentWinnerProductUrl?: string;
  currentWinnerTagline?: string;
  currentBid: number;
  minNextBid: number;
  totalBidsCount: number;
  biddersCount: number;
  lastBidAt: string;
  heatLevel: 'low' | 'medium' | 'high';
  bidsHistory: BidRecord[];
  activeContenders: {
    productId: string;
    productName: string;
    productLogo: string;
    productUrl: string;
    bidAmount: number;
    bidAt: string;
  }[];
}

export interface BidRecord {
  id: string;
  productId: string;
  productName: string;
  productLogo: string;
  productUrl: string;
  countryId: string;
  countryName: string;
  countryFlag: string;
  amount: number;
  bidderName: string;
  bidderEmail?: string;
  timestamp: string;
  txHash: string;
  status: 'active' | 'outbid';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  domain: string;
  url: string;
  tagline: string;
  description: string;
  logoUrl: string;
  ogImage?: string;
  ownerName: string;
  ownerEmail?: string;
  createdAt: string;
  totalGlobalBid: number;
  wonCountries: string[]; // array of country IDs won
  territories: {
    countryId: string;
    countryName: string;
    countryFlag: string;
    bidAmount: number;
    rank: number;
    wonAt: string;
  }[];
  category?: string;
  upvotes?: number;
}

export interface LiveActivityItem {
  id: string;
  type: 'new_bid' | 'outbid' | 'new_listing' | 'price_surge';
  productId: string;
  productName: string;
  productLogo: string;
  countryId: string;
  countryName: string;
  countryFlag: string;
  amount: number;
  text: string;
  timestamp: string;
  fromCountryId?: string;
}

export interface ScrapedMetadata {
  url: string;
  domain: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  favicon?: string;
  logo?: string;
  themeColor?: string;
  extractedName?: string;
}

export interface CheckoutPayload {
  productId: string;
  productName: string;
  productDomain: string;
  productUrl: string;
  productLogo: string;
  productTagline: string;
  productDescription: string;
  selectedCountries: {
    countryId: string;
    bidAmount: number;
  }[];
  bidderName: string;
  bidderEmail: string;
  paymentMethod: 'razorpay' | 'stripe';
  currency: 'USD' | 'INR';
}
