import React from 'react';
import { Product, CountryMarket } from '../types';
import { Trophy, ExternalLink, Sparkles } from 'lucide-react';

interface GlobalLeaderboardProps {
  products: Product[];
  countries: CountryMarket[];
  onSelectProduct: (product: Product) => void;
  onSelectCountryById: (countryId: string) => void;
  onOpenListingModal?: (country?: CountryMarket) => void;
  theme?: 'dark' | 'light';
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  products,
  countries,
  onSelectProduct,
  onSelectCountryById,
  onOpenListingModal,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const openProductSite = (e: React.MouseEvent, url?: string, domain?: string) => {
    e.stopPropagation();
    const targetUrl = url || (domain ? `https://${domain.replace(/^https?:\/\//, '')}` : undefined);
    if (targetUrl) {
      window.open(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div id="global-leaderboard-section" className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`p-1 rounded-full border text-[10.5px] font-mono-terminal font-bold backdrop-blur-md ${
              isDark ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}>
              <Trophy className="w-3 h-3" />
            </span>
            <span className="text-[10.5px] font-mono-terminal font-bold text-amber-500 uppercase tracking-widest font-sora">
              OFFICIAL GLOBAL STANDINGS
            </span>
          </div>
          <h2 className={`text-[21px] sm:text-[32px] font-extrabold font-sora uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            GLOBAL BIDS WAR LEADERBOARD
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-xl font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Rankings determined purely by sovereign territory bids across the Earth. Zero algorithmic distortion.
          </p>
        </div>
      </div>

      {/* Leaderboard Cards matching the exact layout in Screenshot */}
      <div className="space-y-3 sm:space-y-3.5">
        {products.slice(0, 10).map((prod, index) => {
          const rank = index + 1;
          const wonCountryObjects = countries.filter(c => c.currentWinnerProductId === prod.id);
          const maxTerritoryBid = wonCountryObjects.length > 0
            ? Math.max(...wonCountryObjects.map(c => c.currentBid))
            : (prod.totalBidsCount > 0 ? prod.totalBidsCount * 5 : 10);
          const outbidAmount = maxTerritoryBid + (rank === 1 ? 5 : 1);

          return (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className={`cv-auto group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative shadow-sm ${
                rank === 1
                  ? isDark
                    ? 'bg-[#0d1117]/95 hover:bg-[#111622] border-amber-400/50 hover:border-amber-400 shadow-amber-500/5'
                    : 'bg-white hover:bg-slate-50 border-amber-400/80 hover:border-amber-500 shadow-amber-200/20'
                  : isDark
                  ? 'bg-[#0d1117]/95 hover:bg-[#111622] border-white/10 hover:border-sky-500/50'
                  : 'bg-white/95 hover:bg-slate-50 border-slate-200 hover:border-sky-400'
              }`}
            >
              {/* Top Row: Rank Badge + Logo + Name/Domain (Left) & Outbid Button (Right) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Circular Rank Badge */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 font-sora font-extrabold text-xs sm:text-sm border select-none ${
                      rank === 1
                        ? isDark
                          ? 'bg-amber-500/15 border-amber-400/50 text-amber-400'
                          : 'bg-amber-50 border-amber-300 text-amber-700'
                        : rank === 2
                        ? isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-300'
                          : 'bg-slate-100 border-slate-300 text-slate-700'
                        : rank === 3
                        ? isDark
                          ? 'bg-amber-950/40 border-amber-800/40 text-amber-400'
                          : 'bg-amber-100/60 border-amber-300 text-amber-800'
                        : isDark
                        ? 'bg-white/5 border-white/10 text-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Circular Product Avatar */}
                  <img
                    src={prod.logoUrl}
                    alt={prod.name}
                    onClick={(e) => openProductSite(e, prod.url, prod.domain)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border shrink-0 cursor-pointer hover:ring-2 hover:ring-sky-400 transition-all ${
                      isDark ? 'border-white/10 bg-black' : 'border-slate-200 bg-slate-100'
                    }`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(prod.name)}&background=0ea5e9&color=fff`;
                    }}
                    title={`Visit ${prod.name}`}
                  />

                  {/* Product Title & Link with external icon */}
                  <div className="min-w-0 flex-1">
                    <div
                      onClick={(e) => openProductSite(e, prod.url, prod.domain)}
                      className="cursor-pointer group/title inline-flex items-center gap-1 max-w-full"
                      title={`Visit ${prod.name}`}
                    >
                      <h3 className={`font-sora font-bold text-sm sm:text-base truncate group-hover/title:text-sky-400 group-hover/title:underline transition-colors ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}>
                        {prod.name}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <div>
                      <a
                        href={prod.url ? (prod.url.startsWith('http') ? prod.url : `https://${prod.url}`) : `https://${prod.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-400 hover:underline font-mono-terminal truncate"
                      >
                        <span>{prod.domain}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Outbid Pill Button on the Right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (wonCountryObjects.length > 0 && onOpenListingModal) {
                      onOpenListingModal(wonCountryObjects[0]);
                    } else if (wonCountryObjects.length > 0) {
                      onSelectCountryById(wonCountryObjects[0].id);
                    } else if (onOpenListingModal) {
                      onOpenListingModal();
                    } else {
                      onSelectProduct(prod);
                    }
                  }}
                  className={`shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full border text-xs font-sora font-bold transition-all cursor-pointer select-none active:scale-95 shadow-xs ${
                    isDark
                      ? 'bg-white/5 hover:bg-sky-500 hover:text-black border-white/15 hover:border-sky-400 text-white'
                      : 'bg-white hover:bg-sky-500 hover:text-black border-slate-300 hover:border-sky-500 text-slate-900'
                  }`}
                >
                  Outbid: ${outbidAmount}
                </button>
              </div>

              {/* Tagline / Description */}
              <p className={`text-xs sm:text-sm mt-3 mb-2.5 leading-relaxed font-sans-pro line-clamp-2 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {prod.tagline}
              </p>

              {/* Thin grey divider directly below description */}
              <div className="w-full border-b border-slate-200 dark:border-white/10 mb-3" />

              {/* Bottom Row: Territories Indicator (Left) & Details Pill (Right) */}
              <div className="flex items-center justify-between text-xs">
                {/* Territories */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-sora font-bold text-xs text-slate-700 dark:text-slate-300">
                    Territories: {wonCountryObjects.length}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>

                  {/* Country Flag Badges */}
                  {wonCountryObjects.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      {wonCountryObjects.map((c) => (
                        <button
                          key={c.id}
                          title={`${c.name}: $${c.currentBid}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCountryById(c.id);
                          }}
                          className="text-sm sm:text-base hover:scale-125 transition-transform cursor-pointer"
                        >
                          {c.flag}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs font-mono-terminal">None</span>
                  )}
                </div>

                {/* Details Pill */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(prod);
                  }}
                  className={`px-3.5 py-1 rounded-full border text-[11px] font-sora font-semibold transition-all cursor-pointer active:scale-95 ${
                    isDark
                      ? 'bg-slate-900/60 hover:bg-sky-500 hover:text-black border-slate-800 hover:border-sky-400 text-slate-300'
                      : 'bg-slate-100 hover:bg-sky-500 hover:text-black border-slate-200 hover:border-sky-400 text-slate-700'
                  }`}
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className={`p-8 text-center rounded-xl border backdrop-blur-md ${
            isDark ? 'bg-[#0d1117]/80 border-[#1e2638] text-slate-400' : 'bg-white/80 border-slate-200 text-slate-600'
          }`}>
            <p className="text-sm font-sans-pro">No products currently listed in the arena.</p>
          </div>
        )}
      </div>
    </div>
  );
};
