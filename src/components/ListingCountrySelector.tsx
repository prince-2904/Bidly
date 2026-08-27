import React, { useState } from 'react';
import { CountryMarket } from '../types';
import { Check, ArrowRight, ArrowLeft, Search, X } from 'lucide-react';

interface ListingCountrySelectorProps {
  countries: CountryMarket[];
  selectedBids: Record<string, number>;
  toggleCountry: (country: CountryMarket) => void;
  updateCountryBid: (countryId: string, amount: number) => void;
  onBack: () => void;
  onProceedToCheckout: () => void;
  totalBidAmount: number;
  selectedCount: number;
  theme?: 'dark' | 'light';
}

export const ListingCountrySelector: React.FC<ListingCountrySelectorProps> = ({
  countries,
  selectedBids,
  toggleCountry,
  updateCountryBid,
  onBack,
  onProceedToCheckout,
  totalBidAmount,
  selectedCount,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.continent.toLowerCase().includes(q) ||
      (c.currentWinnerProductName && c.currentWinnerProductName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-3.5">
      {/* Selection Info Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3 rounded-xl border backdrop-blur-md text-xs font-mono-terminal ${
        isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-slate-50 border-slate-200'
      }`}>
        <span className="text-slate-400">Select countries to conquer. Unclaimed: $1.</span>
        <span className="text-sky-400 font-bold font-alt">
          {selectedCount} Selected • Total: ${totalBidAmount}
        </span>
      </div>

      {/* Pill Shape Search Bar */}
      <div className="relative w-full">
        <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search territory by name, code, or reigning leader..."
          className={`h-9 w-full rounded-full border pl-9 pr-9 text-xs font-lato focus:outline-none transition-all ${
            isDark
              ? 'bg-[#0d1117] border-white/15 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-500/30 shadow-xs'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-400 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
        {filteredCountries.map((c) => {
          const isSelected = !!selectedBids[c.id];
          const currentBidVal = selectedBids[c.id] || c.minNextBid;

          return (
            <div
              key={c.id}
              onClick={() => toggleCountry(c)}
              className={`p-3 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                isSelected
                  ? (isDark ? 'bg-sky-950/40 border-sky-500' : 'bg-sky-50 border-sky-600 shadow-xs')
                  : (isDark ? 'bg-[#0d1117]/80 border-[#1e2638] hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300')
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{c.flag}</span>
                  <div>
                    <div className={`font-sora font-bold text-xs ${isDark ? 'text-white' : 'text-slate-950'}`}>{c.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono-terminal">{c.code}</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isSelected ? 'bg-sky-500 text-black border-sky-400' : 'border-slate-600 bg-transparent'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono-terminal border-t border-inherit pt-1.5 mt-1.5">
                <div>
                  <span className="text-slate-400 text-[9px]">Leader: </span>
                  <span className={`font-bold truncate block max-w-[80px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {c.currentWinnerProductName || 'None ($1)'}
                  </span>
                </div>

                {isSelected ? (
                  <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-0.5">
                    <span className="text-sky-400 text-xs font-bold font-alt">$</span>
                    <input
                      type="number"
                      min={c.minNextBid}
                      value={currentBidVal}
                      onChange={(e) => updateCountryBid(c.id, Number(e.target.value))}
                      className="w-14 bg-black/60 border border-sky-500 rounded-lg px-1.5 py-0.5 text-xs text-white font-alt font-bold focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400">Min Bid:</span>
                    <div className="text-amber-400 font-bold font-alt">${c.minNextBid}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredCountries.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-slate-400 font-lato">
            No territories found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* Selected Summary */}
      <div className={`p-3.5 rounded-xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-[#07090e]/80 border-[#1e2638]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div>
          <div className="text-[10px] text-slate-400 font-mono-terminal uppercase">Selected Territories</div>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            {Object.keys(selectedBids).map(cid => {
              const c = countries.find(item => item.id === cid);
              return c ? (
                <span key={cid} className={`px-2.5 py-0.5 rounded-full border backdrop-blur-md text-[10px] font-mono-terminal ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-sky-300' : 'bg-white border-slate-200 text-sky-800'
                }`}>
                  {c.flag} {c.name} (${selectedBids[cid]})
                </span>
              ) : null;
            })}
            {selectedCount === 0 && (
              <span className="text-xs text-slate-400 italic">No territory selected</span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] text-slate-400 font-mono-terminal uppercase">Total War Chest</div>
          <div className="text-xl font-black text-sky-400 font-alt">
            ${totalBidAmount}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-3 border-t border-inherit flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`px-4 py-1.5 rounded-full font-sora font-extrabold text-[9.5px] tracking-wide flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer active:scale-95 uppercase border ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              : 'bg-black/5 hover:bg-black/10 border-slate-300 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-2.5 h-2.5 stroke-[3]" />
          <span>Back</span>
        </button>

        <button
          id="modal-continue-to-payment-btn"
          type="button"
          onClick={onProceedToCheckout}
          disabled={selectedCount === 0}
          className="px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-[9.5px] tracking-wide flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer disabled:opacity-40 active:scale-95 uppercase"
        >
          <span>Proceed to Checkout (${totalBidAmount})</span>
          <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

export default ListingCountrySelector;
