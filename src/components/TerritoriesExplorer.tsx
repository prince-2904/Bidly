import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CountryMarket } from '../types';
import { Globe, Search, ArrowUpRight, Plus, Zap, ChevronDown, Check } from 'lucide-react';

interface TerritoriesExplorerProps {
  countries: CountryMarket[];
  onSelectCountry: (country: CountryMarket) => void;
  onOpenListingModal: () => void;
  theme?: 'dark' | 'light';
}

const CONTINENTS = [
  'All',
  'North America',
  'Europe',
  'Asia',
  'South America',
  'Africa',
  'Oceania'
];

export const TerritoriesExplorer: React.FC<TerritoriesExplorerProps> = ({
  countries,
  onSelectCountry,
  onOpenListingModal,
  theme = 'dark'
}) => {
  const [filterContinent, setFilterContinent] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all');
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count claimed vs unclaimed
  const claimedCount = useMemo(() => countries.filter(c => !!c.currentWinnerProductId).length, [countries]);
  const unclaimedCount = useMemo(() => countries.filter(c => !c.currentWinnerProductId).length, [countries]);

  // Filter countries by continent, status, and search term
  const filteredCountries = useMemo(() => {
    return countries
      .filter(c => {
        const isClaimed = !!c.currentWinnerProductId;
        if (statusFilter === 'claimed' && !isClaimed) return false;
        if (statusFilter === 'unclaimed' && isClaimed) return false;

        const matchesContinent = filterContinent === 'All' || c.continent === filterContinent;
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          (c.currentWinnerProductName && c.currentWinnerProductName.toLowerCase().includes(search.toLowerCase()));
        return matchesContinent && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, statusFilter, filterContinent, search]);

  // Continent count map for display in dropdown
  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: countries.length };
    CONTINENTS.slice(1).forEach(cont => {
      counts[cont] = countries.filter(c => c.continent === cont).length;
    });
    return counts;
  }, [countries]);

  return (
    <div id="territories-explorer-section" className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`p-1 rounded-full border text-xs font-lato font-bold ${
              isDark ? 'bg-sky-950/60 text-sky-400 border-sky-800/60' : 'bg-sky-50 text-sky-700 border-sky-300'
            }`}>
              <Globe className="w-3 h-3" />
            </span>
            <span className="text-[11px] font-lato font-bold text-sky-400 uppercase tracking-widest font-sora">
              195 SOVEREIGN DISCOVERY MARKETS
            </span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold font-sora uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            GLOBAL TERRITORIES DIRECTORY
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-xl font-lato ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore all 195 recognized sovereign countries (193 UN member states + 2 observer states). Outbid the leader to claim top regional discovery.
          </p>
        </div>

        {/* Action Controls: Search Box, Continent Dropdown, Claimed & Unclaimed Territory Small Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box Pill with Search Icon on the Left */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 195 countries..."
              className={`h-9 rounded-full border pl-9 pr-3.5 text-xs font-lato focus:outline-none w-full sm:w-44 md:w-48 transition-all ${
                isDark
                  ? 'bg-[#090d14] border-white/15 text-white placeholder-slate-500 focus:border-sky-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600'
              }`}
            />
          </div>

          {/* Custom Continent Dropdown Section Pill */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className={`h-9 px-3 rounded-full border text-xs font-sora font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none whitespace-nowrap active:scale-95 ${
                isDark
                  ? 'bg-[#090d14] hover:bg-[#101622] border-white/15 text-slate-200 hover:border-sky-500/50'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:border-sky-500'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-[11px]">
                {filterContinent === 'All' ? `All Continents (${countries.length})` : filterContinent}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
            </button>

            {/* Custom Dropdown Floating Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute right-0 sm:left-0 top-full mt-1.5 w-52 rounded-2xl border py-1.5 z-30 transition-all ${
                  isDark
                    ? 'bg-[#090d14] border-white/15 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <div className={`px-3 py-1.5 text-[10px] font-mono-terminal uppercase font-bold tracking-wider border-b ${
                  isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100'
                }`}>
                  Select Region / Continent
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {CONTINENTS.map((cont) => {
                    const isSelected = filterContinent === cont;
                    const count = continentCounts[cont] ?? 0;

                    return (
                      <button
                        key={cont}
                        type="button"
                        onClick={() => {
                          setFilterContinent(cont);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs font-sora text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-sky-950/70 text-sky-400 font-bold'
                              : 'bg-sky-50 text-sky-700 font-bold'
                            : isDark
                              ? 'hover:bg-slate-800/70 text-slate-300'
                              : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{cont}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className={`text-[10px] font-mono-terminal px-1.5 py-0.2 rounded-full border ${
                            isSelected
                              ? isDark ? 'border-sky-800 text-sky-400' : 'border-sky-300 text-sky-700'
                              : isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                          }`}>
                            {count}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Two Small Filter Pills: Claimed Territory & Unclaimed Territory */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter(prev => prev === 'claimed' ? 'all' : 'claimed')}
              className={`h-9 px-3 rounded-full border text-[11px] font-sora font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                statusFilter === 'claimed'
                  ? 'bg-sky-500 text-black font-extrabold border-sky-400 shadow-sm'
                  : isDark
                    ? 'bg-[#090d14] hover:bg-[#101622] border-white/15 text-slate-300 hover:text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'claimed' ? 'bg-black' : 'bg-sky-400'}`} />
              <span>Claimed Territory</span>
              <span className={`text-[10px] font-mono-terminal px-1 rounded-full ${
                statusFilter === 'claimed' ? 'bg-black/20 text-black font-bold' : 'text-slate-400'
              }`}>
                {claimedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter(prev => prev === 'unclaimed' ? 'all' : 'unclaimed')}
              className={`h-9 px-3 rounded-full border text-[11px] font-sora font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                statusFilter === 'unclaimed'
                  ? 'bg-amber-500 text-black font-extrabold border-amber-400 shadow-sm'
                  : isDark
                    ? 'bg-[#090d14] hover:bg-[#101622] border-white/15 text-slate-300 hover:text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'unclaimed' ? 'bg-black' : 'bg-amber-400'}`} />
              <span>Unclaimed Territory</span>
              <span className={`text-[10px] font-mono-terminal px-1 rounded-full ${
                statusFilter === 'unclaimed' ? 'bg-black/20 text-black font-bold' : 'text-slate-400'
              }`}>
                {unclaimedCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Countries */}
      {filteredCountries.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${
          isDark ? 'bg-[#090d14] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50 text-sky-400" />
          <p className="font-sora font-semibold text-sm">No territories found for current filters</p>
          <button
            onClick={() => {
              setFilterContinent('All');
              setSearch('');
            }}
            className="mt-3 text-xs text-sky-400 font-lato hover:underline cursor-pointer"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCountries.map(c => {
            const isClaimed = !!c.currentWinnerProductId;

            return (
              <div
                key={c.id}
                onClick={() => onSelectCountry(c)}
                className={`cv-auto p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-[#090d14] hover:bg-[#101622] border-white/10 hover:border-sky-500/40'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-sky-400'
                }`}
              >
                <div>
                  {/* Top Bar: Flag, Name, Continent & High Bid Status Pill */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{c.flag}</span>
                      <div className="min-w-0">
                        <h3 className={`font-sora font-bold text-xs sm:text-sm truncate group-hover:text-sky-400 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-950'
                        }`}>
                          {c.name}
                        </h3>
                        <div className={`text-[9.5px] font-lato truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {c.continent} • {c.code}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-lato font-bold uppercase border shrink-0 ${
                      isClaimed
                        ? c.currentBid >= 25
                          ? (isDark ? 'bg-amber-950/80 text-amber-400 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-300')
                          : (isDark ? 'bg-sky-950/80 text-sky-400 border-sky-800' : 'bg-sky-100 text-sky-800 border-sky-300')
                        : (isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200')
                    }`}>
                      {isClaimed ? `$${c.currentBid}` : 'OPEN'}
                    </span>
                  </div>

                  {/* Highest Bid Product Display */}
                  {isClaimed ? (
                    <div className={`p-2.5 rounded-xl border space-y-1 mb-2.5 transition-colors ${
                      isDark ? 'bg-[#05070c] border-white/10 group-hover:border-sky-900/60' : 'bg-slate-50 border-slate-200 group-hover:border-sky-200'
                    }`}>
                      <div className="flex items-center justify-between text-[9.5px] font-lato uppercase text-slate-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-sky-400" />
                          <span>Highest Bid Product</span>
                        </span>
                        <span className="text-sky-400 font-bold font-alt">${c.currentBid}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <img
                          src={c.currentWinnerProductLogo}
                          alt={c.currentWinnerProductName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.currentWinnerProductName || c.name)}&background=0ea5e9&color=fff`;
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className={`font-sora font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {c.currentWinnerProductName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Unclaimed Territory Box */
                    <div className={`p-2.5 rounded-xl border border-dashed text-center py-3.5 mb-2.5 ${
                      isDark ? 'bg-[#05070c] border-slate-800' : 'bg-slate-50 border-slate-300'
                    }`}>
                      <div className="text-[11px] text-slate-400 font-medium font-lato">No active bids placed</div>
                      <div className="text-sky-400 font-sora font-bold text-[11px] mt-0.5">
                        Be First Leader ($1)
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Outbid CTA */}
                <div className="flex items-center justify-between border-t border-inherit pt-2 text-[11px] font-lato">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Next Bid: <strong className="text-sky-400 font-alt">${c.minNextBid}</strong>
                  </span>
                  <span className="text-sky-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-sora text-[11px]">
                    <span>{isClaimed ? 'Outbid #1' : 'Claim'}</span>
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TerritoriesExplorer;
