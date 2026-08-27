import React, { useState, useMemo } from 'react';
import { ArrowRight, Globe2, Loader2, Zap } from 'lucide-react';
import { LiveActivityItem, CountryMarket } from '../types';

interface HeroSectionProps {
  onSubmitUrl: (url: string) => void;
  isLoadingMetadata: boolean;
  activities: LiveActivityItem[];
  countries: CountryMarket[];
  onSelectCountry: (country: CountryMarket) => void;
  theme?: 'dark' | 'light';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSubmitUrl,
  isLoadingMetadata,
  activities,
  countries,
  onSelectCountry,
  theme = 'dark'
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onSubmitUrl(inputUrl.trim());
  };

  // Recent bids ordered strictly chronologically by recency (most recent bid first)
  const recentBidsList = useMemo(() => {
    const list: {
      id: string;
      countryId: string;
      countryName: string;
      countryFlag: string;
      productName: string;
      amount: number;
    }[] = [];

    // 1. Process live activities (unshifted on new bids = index 0 is newest)
    if (activities && activities.length > 0) {
      activities.forEach((act, idx) => {
        if (act.countryId && act.countryId !== 'GLOBAL') {
          list.push({
            id: act.id || `act-${idx}`,
            countryId: act.countryId,
            countryName: act.countryName,
            countryFlag: act.countryFlag,
            productName: act.productName,
            amount: act.amount
          });
        }
      });
    }

    // 2. Include country bids history (most recent first)
    countries.forEach(c => {
      if (c.bidsHistory && c.bidsHistory.length > 0) {
        c.bidsHistory.forEach(bh => {
          list.push({
            id: bh.id,
            countryId: c.id,
            countryName: c.name,
            countryFlag: c.flag,
            productName: bh.productName,
            amount: bh.amount
          });
        });
      }
    });

    // 3. Deduplicate preserving chronological recency order
    const seen = new Set<string>();
    const deduplicated: typeof list = [];
    for (const item of list) {
      const key = `${item.countryId}-${item.productName}-${item.amount}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(item);
      }
    }

    // 4. Fallback if no bids yet
    if (deduplicated.length === 0) {
      return countries
        .filter(c => c.currentWinnerProductId)
        .slice(0, 6)
        .map(c => ({
          id: c.id,
          countryId: c.id,
          countryName: c.name,
          countryFlag: c.flag,
          productName: c.currentWinnerProductName || '',
          amount: c.currentBid
        }));
    }

    return deduplicated.slice(0, 8);
  }, [activities, countries]);

  return (
    <div className="relative pt-6 pb-3 sm:pt-9 sm:pb-5 overflow-hidden">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 text-center relative z-10">
        {/* Main Heading - Sora */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold font-sora tracking-tight mb-4 flex flex-col items-center justify-center leading-tight sm:leading-tight ${
          isDark ? 'text-white' : 'text-slate-950'
        }`}>
          <span>War For</span>
          <span className="text-sky-500">Territory</span>
        </h1>

        {/* Supporting Text - Lato */}
        <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed font-lato ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          A transparent global discovery engine across 195 sovereign nations where product visibility is won through real-world bidding.
          Bid more. Rank higher. Get discovered.
        </p>

        {/* Product URL Input Form - Slight Glass Round Box & Glass Pill Button */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-5">
          <div className={`flex flex-col sm:flex-row items-stretch p-1.5 rounded-2xl border backdrop-blur-xl transition-all shadow-lg ${
            isDark
              ? 'bg-[#090d14]/75 border-sky-500/30 focus-within:border-sky-400 shadow-sky-500/5'
              : 'bg-white/85 border-slate-300 focus-within:border-sky-600 shadow-slate-200'
          }`}>
            <div className="flex items-center gap-2 pl-3 flex-1 min-h-[40px]">
              <Globe2 className="w-4 h-4 text-sky-500 shrink-0" />
              <input
                id="hero-product-url-input"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter your product website URL (https://...)"
                disabled={isLoadingMetadata}
                className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none font-lato py-1 ${
                  isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              id="hero-enter-war-submit-btn"
              type="submit"
              disabled={isLoadingMetadata || !inputUrl.trim()}
              className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md backdrop-blur-md uppercase tracking-wide active:scale-95"
            >
              {isLoadingMetadata ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>ENTER THE WAR AT JUST $1</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Bidding Activity Ticker Tape - Glass Touch (10% Reduced Size) */}
        <div className={`max-w-3xl mx-auto p-1.5 rounded-2xl border backdrop-blur-xl overflow-hidden shadow-xs ${
          isDark ? 'bg-[#090d14]/75 border-white/10' : 'bg-slate-100/80 border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-lato overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
            <div className="flex items-center gap-1 text-sky-400 font-bold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 shrink-0 text-[10.5px] backdrop-blur-md">
              <Zap className="w-2.5 h-2.5 fill-sky-400 text-sky-400" />
              <span className="font-sora">Recent Bids:</span>
            </div>

            {recentBidsList.map((rb) => {
              const country = countries.find(c => c.id === rb.countryId);
              return (
                <div
                  key={rb.id}
                  onClick={() => {
                    if (country) onSelectCountry(country);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border backdrop-blur-xl cursor-pointer transition-all shrink-0 text-[10.5px] shadow-xs hover:scale-105 active:scale-95 ${
                    isDark
                      ? 'bg-[#0d121c]/80 hover:bg-slate-800 border-white/10 text-slate-200 hover:border-sky-500/50'
                      : 'bg-white/80 hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-500/50'
                  }`}
                >
                  <span>{rb.countryFlag}</span>
                  <span className="font-sora font-semibold text-[10px]">{rb.countryName}</span>
                  <span className="text-slate-500 text-[9px]">:</span>
                  <span className="text-sky-400 font-bold">{rb.productName}</span>
                  <span className="text-slate-500 text-[9px]">→</span>
                  <span className="text-amber-400 font-bold font-alt">${rb.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
