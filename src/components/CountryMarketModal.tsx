import React, { useState } from 'react';
import { CountryMarket } from '../types';
import { X, ExternalLink, Award, Sparkles, Swords, ArrowUpRight } from 'lucide-react';

interface CountryMarketModalProps {
  country: CountryMarket;
  onClose: () => void;
  onPlaceBidForCountry: (country: CountryMarket, bidAmount: number) => void;
  onViewProduct: (productId: string) => void;
  theme?: 'dark' | 'light';
}

export const CountryMarketModal: React.FC<CountryMarketModalProps> = ({
  country,
  onClose,
  onPlaceBidForCountry,
  onViewProduct,
  theme = 'dark'
}) => {
  const [customBid, setCustomBid] = useState<number>(country.minNextBid);
  const isDark = theme === 'dark';

  const openProductSite = (e: React.MouseEvent, url?: string, name?: string) => {
    e.stopPropagation();
    const targetUrl = url || (name ? `https://${name.toLowerCase().replace(/\s+/g, '')}.com` : undefined);
    if (targetUrl) {
      window.open(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQuickBid = (increment: number) => {
    setCustomBid(country.minNextBid + increment);
  };

  const handleOutbidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBid < country.minNextBid) return;
    onPlaceBidForCountry(country, customBid);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 animate-fadeIn">
      <div
        id="country-market-modal-card"
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 transition-all shadow-2xl ${
          isDark
            ? 'bg-[#090d14] border-white/15 text-white shadow-black/90'
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          id="country-modal-close-btn"
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
            isDark ? 'bg-[#0d1117] hover:bg-slate-800 border-[#1e2638] text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Country Header */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          <span className="text-3xl sm:text-4xl">{country.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className={`text-xl sm:text-2xl font-black font-sora tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {country.name}
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-terminal font-bold border ${
                isDark ? 'bg-sky-950/80 text-sky-400 border-sky-800' : 'bg-sky-50 text-sky-800 border-sky-300'
              }`}>
                {country.code}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-terminal border ${
                isDark ? 'bg-slate-900/80 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {country.continent}
              </span>
            </div>
            <p className={`text-[11px] font-mono-terminal mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sovereign Territory • Live Competitive Bidding
            </p>
          </div>
        </div>

        {/* Current Winner Banner */}
        {country.currentWinnerProductId ? (
          <div className={`mb-4 p-4 rounded-xl border relative overflow-hidden shadow-xs ${
            isDark
              ? 'bg-[#0d1117] border-sky-500/40'
              : 'bg-sky-50/50 border-sky-400 shadow-xs'
          }`}>
            <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-sky-500 text-black text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1 font-mono-terminal rounded-bl-lg">
              <Award className="w-3 h-3" />
              <span>TERRITORY LEADER</span>
            </div>

            <div className="text-[10px] font-mono-terminal text-sky-400 mb-1.5 uppercase font-bold">
              Current Reigning Leader
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={country.currentWinnerProductLogo}
                  alt={country.currentWinnerProductName}
                  className={`w-10 h-10 rounded-full object-cover border shrink-0 ${isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-white'}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(country.currentWinnerProductName || country.name)}&background=0ea5e9&color=fff`;
                  }}
                />
                <div>
                  <h3 className={`text-base font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {country.currentWinnerProductName}
                  </h3>
                  <p className={`text-xs max-w-xs line-clamp-1 font-sans-pro ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {country.currentWinnerTagline || 'High-performance software product competing globally.'}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-inherit pt-2 sm:pt-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono-terminal uppercase">Dominant Bid</div>
                  <div className="text-xl font-black text-amber-400 font-alt">
                    ${country.currentBid}
                  </div>
                </div>
                {country.currentWinnerProductUrl && (
                  <a
                    href={country.currentWinnerProductUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline font-bold mt-0.5"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`mb-4 p-4 rounded-xl border border-dashed backdrop-blur-md text-center ${
            isDark ? 'bg-[#0d1117]/60 border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}>
            <h3 className={`text-sm font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>Unclaimed Territory</h3>
            <p className={`text-xs max-w-sm mx-auto mt-0.5 mb-2 font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No product currently holds this country. Be the first maker to plant your flag for just $1!
            </p>
            <div className="text-base font-mono-terminal font-extrabold text-sky-400 font-alt">
              Starting Bid: $1
            </div>
          </div>
        )}

        {/* Territory Stats HUD Bar */}
        <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-xl border mb-4 text-center font-mono-terminal ${
          isDark ? 'bg-[#07090e] border-[#1e2638]' : 'bg-slate-100 border-slate-200'
        }`}>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Min Next Bid</div>
            <div className="text-sm font-bold text-sky-400 font-alt">${country.minNextBid}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Total Bids</div>
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {country.bidsHistory?.length || (country.currentWinnerProductId ? 1 : 0)}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Bidders</div>
            <div className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {country.activeContenders?.length || (country.currentWinnerProductId ? 1 : 0)}
            </div>
          </div>
        </div>

        {/* Outbid Action Box */}
        <div className={`mb-4 p-3.5 rounded-xl border ${
          isDark ? 'bg-[#0d1117] border-sky-500/30' : 'bg-white border-sky-600 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono-terminal font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1 font-sora">
              <Swords className="w-3.5 h-3.5" />
              <span>Outbid & Claim #1</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono-terminal">
              Min Bid: ${country.minNextBid}
            </span>
          </div>

          <form onSubmit={handleOutbidSubmit} className="space-y-2.5">
            {/* Preset Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setCustomBid(country.minNextBid)}
                className={`px-3 py-1 rounded-full text-xs font-mono-terminal font-bold border transition-all cursor-pointer ${
                  customBid === country.minNextBid
                    ? 'bg-sky-500 text-black border-sky-400 font-extrabold'
                    : (isDark ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200')
                }`}
              >
                Min: ${country.minNextBid}
              </button>
              <button
                type="button"
                onClick={() => handleQuickBid(5)}
                className={`px-3 py-1 rounded-full text-xs font-mono-terminal font-bold border transition-all cursor-pointer ${
                  customBid === country.minNextBid + 5
                    ? 'bg-sky-500 text-black border-sky-400 font-extrabold'
                    : (isDark ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200')
                }`}
              >
                + $5 (${country.minNextBid + 5})
              </button>
              <button
                type="button"
                onClick={() => handleQuickBid(15)}
                className={`px-3 py-1 rounded-full text-xs font-mono-terminal font-bold border transition-all cursor-pointer ${
                  customBid === country.minNextBid + 15
                    ? 'bg-sky-500 text-black border-sky-400 font-extrabold'
                    : (isDark ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200')
                }`}
              >
                + $15 (${country.minNextBid + 15})
              </button>
            </div>

            {/* Custom Input + Pill Submit Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono-terminal font-bold text-xs">
                  $
                </span>
                <input
                  id="country-bid-amount-input"
                  type="number"
                  min={country.minNextBid}
                  value={customBid}
                  onChange={(e) => setCustomBid(Math.max(country.minNextBid, Number(e.target.value)))}
                  className={`w-full rounded-full border pl-7 pr-3 py-2 font-alt font-bold text-sm focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#07090e] border-[#1e2638] text-white focus:border-sky-400'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-sky-600'
                  }`}
                />
              </div>

              <button
                id="country-outbid-submit-btn"
                type="submit"
                className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
              >
                <span>Outbid for {country.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </form>
        </div>

        {/* All Contenders Header */}
        <div className="flex items-center justify-between border-b border-inherit pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sora font-extrabold uppercase tracking-wider text-sky-400">
              All Contenders
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-terminal font-bold border ${
              isDark ? 'bg-slate-900/80 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {country.activeContenders?.length || 0}
            </span>
          </div>
          <span className="text-[10px] font-mono-terminal text-slate-400">
            Ranked by High Bid
          </span>
        </div>

        {/* Contenders List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {country.activeContenders && country.activeContenders.length > 0 ? (
            country.activeContenders.map((contender, idx) => (
              <div
                key={contender.productId + idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#0d1117] border-[#1e2638]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  onClick={(e) => openProductSite(e, contender.productUrl, contender.productName)}
                  className="flex items-center gap-2 cursor-pointer group/item min-w-0 flex-1 mr-2"
                  title={`Visit ${contender.productName}`}
                >
                  <span className="font-mono-terminal text-[11px] font-bold text-slate-400 w-4 shrink-0">
                    0{idx + 1}
                  </span>
                  <img
                    src={contender.productLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(contender.productName)}&background=0ea5e9&color=fff`}
                    alt={contender.productName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 group-hover/item:ring-1 group-hover/item:ring-sky-400 transition-all"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contender.productName)}&background=0ea5e9&color=fff`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1 max-w-full">
                      <span className={`font-sora font-bold text-xs truncate group-hover/item:text-sky-400 group-hover/item:underline transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {contender.productName}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-sky-400 shrink-0 opacity-80 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-alt font-extrabold text-xs text-amber-400">
                    ${contender.bidAmount}
                  </div>
                  {idx === 0 ? (
                    <span className="text-[9px] text-sky-400 font-bold">#1 Leader</span>
                  ) : (
                    <span className="text-[9px] text-slate-400">Contender</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-slate-400 font-mono-terminal">
              No competitor bids logged yet. Claim this country first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
