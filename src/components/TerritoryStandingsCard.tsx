import React from 'react';
import { CountryMarket, Product } from '../types';
import { Crown, Medal, ArrowUpRight, Swords } from 'lucide-react';

interface TerritoryStandingsCardProps {
  country: CountryMarket;
  winnerProduct: Product | null | undefined;
  topThree: {
    productId: string;
    productName: string;
    productLogo: string;
    bidAmount: number;
    bidAt?: string;
  }[];
  productMap: Map<string, Product>;
  onSelectCountry: (country: CountryMarket) => void;
  onSelectProduct: (product: Product) => void;
  onOpenListingModalForCountry: (countryId: string) => void;
  theme?: 'dark' | 'light';
}

export const TerritoryStandingsCard: React.FC<TerritoryStandingsCardProps> = ({
  country,
  winnerProduct,
  topThree,
  productMap,
  onSelectCountry,
  onSelectProduct,
  onOpenListingModalForCountry,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const openProductSite = (e: React.MouseEvent, url?: string, fallbackDomain?: string) => {
    e.stopPropagation();
    const targetUrl = url || (fallbackDomain ? `https://${fallbackDomain.replace(/^https?:\/\//, '')}` : undefined);
    if (targetUrl) {
      window.open(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between relative group ${
        isDark
          ? 'bg-[#090d14] border-white/10 hover:border-sky-500/40 shadow-lg shadow-black/40'
          : 'bg-white border-slate-200 hover:border-sky-400 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Card Top: Country Flag & Info */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div 
            onClick={() => onSelectCountry(country)}
            className="flex items-center gap-2.5 cursor-pointer group/flag"
          >
            <span className="text-2xl sm:text-3xl transition-transform group-hover/flag:scale-110">
              {country.flag}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className={`font-sora font-bold text-sm sm:text-base group-hover/flag:text-sky-400 transition-colors uppercase ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  {country.name}
                </h3>
                <span className={`text-[9px] font-mono-terminal px-1.5 py-0.2 rounded border ${
                  isDark ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {country.code}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-terminal">
                {country.continent} • {(country.activeContenders?.length || (country.currentWinnerProductId ? 1 : 0))} {(country.activeContenders?.length || (country.currentWinnerProductId ? 1 : 0)) === 1 ? 'Bidder' : 'Bidders'}
              </span>
            </div>
          </div>

          {/* Dominant Bid Pill */}
          <div className="text-right">
            <span className="text-[9px] font-mono-terminal text-slate-400 uppercase block">Top Bid</span>
            <span className="text-base font-black text-amber-400 font-alt">${country.currentBid}</span>
          </div>
        </div>

        {/* Reigning #1 Leader Spotlight Card */}
        <div 
          onClick={() => {
            if (winnerProduct) {
              onSelectProduct(winnerProduct);
            } else {
              onSelectCountry(country);
            }
          }}
          className={`p-3 rounded-xl border mb-3 cursor-pointer transition-all ${
            isDark
              ? 'bg-[#0d121c] hover:bg-[#121927] border-sky-500/30 hover:border-sky-400'
              : 'bg-sky-50/70 hover:bg-sky-50 border-sky-300 hover:border-sky-500'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[9px] font-mono-terminal font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-500 text-black flex items-center gap-1 font-sora">
              <Crown className="w-2.5 h-2.5" />
              <span>#1 Dominant Leader</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <img
              src={country.currentWinnerProductLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(country.currentWinnerProductName || 'Product')}&background=0ea5e9&color=fff`}
              alt={country.currentWinnerProductName}
              onClick={(e) => openProductSite(e, country.currentWinnerProductUrl, winnerProduct?.domain)}
              className={`w-9 h-9 rounded-full object-cover border shrink-0 cursor-pointer hover:ring-2 hover:ring-sky-400 transition-all ${
                isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-white'
              }`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(country.currentWinnerProductName || 'Product')}&background=0ea5e9&color=fff`;
              }}
              title={`Visit ${country.currentWinnerProductName}`}
            />
            <div className="min-w-0 flex-1">
              <div 
                onClick={(e) => openProductSite(e, country.currentWinnerProductUrl, winnerProduct?.domain)}
                className="flex items-center gap-1 cursor-pointer group/title inline-flex max-w-full"
                title={`Visit ${country.currentWinnerProductName}`}
              >
                <h4 className={`font-sora font-bold text-xs sm:text-sm truncate group-hover/title:text-sky-400 group-hover/title:underline transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {country.currentWinnerProductName}
                </h4>
                <ArrowUpRight className="w-3 h-3 text-sky-400 shrink-0 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-transform" />
              </div>
              <p className={`text-[10.5px] truncate font-lato ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {country.currentWinnerTagline || 'Competing globally for sovereign visibility'}
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Bidders Podium List */}
        <div className="mb-4 space-y-1.5">
          <div className="text-[10px] font-mono-terminal uppercase font-bold text-slate-400 flex items-center justify-between px-1">
            <span className="flex items-center gap-1 font-sora">
              <Medal className="w-3 h-3 text-amber-400" />
              <span>Top 3 Contenders Leaderboard</span>
            </span>
            <span>Bid Amount</span>
          </div>

          {/* Filled Contender Slots */}
          {topThree.map((contender, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={contender.productId + idx}
                onClick={() => onOpenListingModalForCountry(country.id)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer active:scale-98 ${
                  isFirst
                    ? (isDark
                        ? 'bg-amber-950/20 border-amber-500/50 text-slate-100 hover:border-amber-400 hover:bg-amber-500/15'
                        : 'bg-amber-50 border-amber-300 text-slate-900 hover:bg-amber-100')
                    : isSecond
                    ? (isDark
                        ? 'bg-slate-400/10 border-slate-300/40 text-slate-200 hover:border-slate-200 hover:bg-slate-400/20 shadow-xs'
                        : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200 shadow-xs')
                    : (isDark
                        ? 'bg-[#24140a]/60 border-[#854519]/70 text-[#f5c69e] hover:border-[#ba6829] hover:bg-[#381c0c]/80 shadow-xs'
                        : 'bg-[#fbf3ec] border-[#c4773b]/60 text-[#5c2b0e] hover:border-[#9e4c19] hover:bg-[#f7e6d7] shadow-xs')
                }`}
                title="Click to enter bid war on this territory"
              >
                <div 
                  onClick={(e) => openProductSite(e, (contender as any).productUrl, contender.productName)}
                  className="flex items-center gap-1.5 min-w-0 cursor-pointer group/c hover:underline"
                  title={`Visit ${contender.productName}`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono-terminal font-black text-[9px] shrink-0 shadow-xs ${
                    isFirst
                      ? 'bg-amber-400 text-black font-extrabold ring-1 ring-amber-300'
                      : isSecond
                      ? 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 text-slate-950 font-black ring-1 ring-slate-300'
                      : 'bg-gradient-to-br from-[#c4773b] via-[#944c1b] to-[#5e2b0a] text-[#fff1e6] font-black ring-1 ring-[#d4894d]'
                  }`}>
                    {idx + 1}
                  </span>
                  <img
                    src={contender.productLogo}
                    alt={contender.productName}
                    className="w-4 h-4 rounded-full object-cover border border-slate-700 shrink-0 group-hover/c:ring-1 group-hover/c:ring-sky-400"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contender.productName)}&background=0ea5e9&color=fff`;
                    }}
                  />
                  <div className="inline-flex items-center gap-1 min-w-0">
                    <span className="font-sora font-semibold text-[11px] truncate group-hover/c:text-sky-400">
                      {contender.productName}
                    </span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-sky-400 shrink-0 opacity-70 group-hover/c:opacity-100 group-hover/c:translate-x-0.5 group-hover/c:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`font-mono-terminal font-extrabold font-alt text-[11px] ${
                    isFirst
                      ? 'text-amber-400'
                      : isSecond
                      ? (isDark ? 'text-slate-300' : 'text-slate-700')
                      : (isDark ? 'text-[#f7a86d]' : 'text-[#a85a22]')
                  }`}>
                    ${contender.bidAmount}
                  </span>
                  {isFirst && (
                    <span className="text-[8.5px] font-bold text-amber-400 font-mono-terminal">#1</span>
                  )}
                  {isSecond && (
                    <span className={`text-[8.5px] font-bold font-mono-terminal ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>#2</span>
                  )}
                  {isThird && (
                    <span className={`text-[8.5px] font-bold font-mono-terminal ${
                      isDark ? 'text-[#f3a469]' : 'text-[#a85a22]'
                    }`}>#3</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty Open Slots Rendered as Individual Pills with Silver (#2) and Bronze (#3) feels */}
          {Array.from({ length: Math.max(0, 3 - topThree.length) }).map((_, i) => {
            const slotNumber = topThree.length + i + 1;
            const isSlot2 = slotNumber === 2;
            const isSlot3 = slotNumber === 3;

            return (
              <button
                key={`empty-slot-${slotNumber}`}
                type="button"
                onClick={() => onOpenListingModalForCountry(country.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full border border-dashed text-[10.5px] font-mono-terminal transition-all cursor-pointer active:scale-98 text-left ${
                  isSlot2
                    ? (isDark
                        ? 'bg-slate-500/10 border-slate-400/40 text-slate-200 hover:border-slate-300 hover:bg-slate-500/20 shadow-xs'
                        : 'bg-slate-100/80 border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-200/80 shadow-xs')
                    : isSlot3
                    ? (isDark
                        ? 'bg-[#24140a]/40 border-[#854519]/50 text-[#f5c69e] hover:border-[#ba6829] hover:bg-[#381c0c]/60 shadow-xs'
                        : 'bg-[#fbf3ec]/90 border-[#c4773b]/50 text-[#5c2b0e] hover:border-[#9e4c19] hover:bg-[#f7e6d7] shadow-xs')
                    : (isDark
                        ? 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-sky-400 hover:bg-sky-500/10'
                        : 'bg-slate-50/70 border-slate-300 text-slate-500 hover:border-sky-500 hover:bg-sky-50')
                }`}
                title={`Claim Slot #${slotNumber}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full border border-dashed flex items-center justify-center text-[9px] font-extrabold shrink-0 shadow-xs ${
                    isSlot2
                      ? (isDark
                          ? 'border-slate-400 text-slate-100 bg-slate-700 ring-1 ring-slate-500'
                          : 'border-slate-500 text-white bg-slate-600 ring-1 ring-slate-400')
                      : isSlot3
                      ? (isDark
                          ? 'border-[#a85a22] text-[#fff1e6] bg-[#70330e] ring-1 ring-[#c47c49]/50'
                          : 'border-[#8c4314] text-[#fff1e6] bg-[#8c4314] ring-1 ring-[#b86127]')
                      : 'border-slate-500 text-slate-400'
                  }`}>
                    {slotNumber}
                  </span>
                  <span className={`font-sora font-medium ${
                    isSlot2
                      ? (isDark ? 'text-slate-200 font-semibold' : 'text-slate-800 font-semibold')
                      : isSlot3
                      ? (isDark ? 'text-[#f5c69e] font-semibold' : 'text-[#6e3715] font-semibold')
                      : ''
                  }`}>
                    Slot #{slotNumber} Open
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9.5px] opacity-75">Min bid:</span>
                  <strong className={`font-bold font-alt ${
                    isSlot2
                      ? (isDark ? 'text-slate-300' : 'text-slate-800')
                      : isSlot3
                      ? (isDark ? 'text-[#f7a86d]' : 'text-[#a85a22]')
                      : 'text-sky-400'
                  }`}>
                    ${country.minNextBid}
                  </strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Actions: Outbid Button & View Country */}
      <div className="flex items-center gap-2 pt-2 border-t border-inherit">
        <button
          type="button"
          onClick={() => onOpenListingModalForCountry(country.id)}
          className="flex-1 py-2 px-3 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider active:scale-95 shadow-sm"
        >
          <Swords className="w-3 h-3" />
          <span>Outbid #1 (${country.minNextBid})</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCountry(country)}
          className={`py-2 px-3 rounded-full border text-[11px] font-sora font-bold transition-all cursor-pointer ${
            isDark 
              ? 'bg-[#0d121c] hover:bg-slate-800 border-white/10 text-slate-300 hover:text-white' 
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
          }`}
        >
          Details
        </button>
      </div>
    </div>
  );
};
