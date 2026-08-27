import React, { useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Globe, Flag, Check, X, RotateCcw } from 'lucide-react';
import { CountryMarket } from '../types';

interface ContinentItem {
  id: string;
  name: string;
}

interface TerritoryStandingsFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedContinent: string;
  setSelectedContinent: (c: string) => void;
  selectedCountryId: string;
  setSelectedCountryId: (id: string) => void;
  isContinentDropdownOpen: boolean;
  setIsContinentDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isCountryDropdownOpen: boolean;
  setIsCountryDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  continents: ContinentItem[];
  availableCountries: CountryMarket[];
  filteredCount: number;
  totalClaimedCount?: number;
  totalCountriesCount?: number;
  theme?: 'dark' | 'light';
}

export const TerritoryStandingsFilters: React.FC<TerritoryStandingsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedContinent,
  setSelectedContinent,
  selectedCountryId,
  setSelectedCountryId,
  isContinentDropdownOpen,
  setIsContinentDropdownOpen,
  isCountryDropdownOpen,
  setIsCountryDropdownOpen,
  continents,
  availableCountries,
  filteredCount,
  totalClaimedCount = 23,
  totalCountriesCount = 195,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const continentRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  // Robust outside click detection using click event
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (continentRef.current && !continentRef.current.contains(target)) {
        setIsContinentDropdownOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setIsContinentDropdownOpen, setIsCountryDropdownOpen]);

  // Continent count map for display in dropdown
  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = { all: availableCountries.length };
    continents.forEach(c => {
      if (c.id !== 'all') {
        counts[c.id] = availableCountries.filter(item => item.continent === c.id).length;
      }
    });
    return counts;
  }, [availableCountries, continents]);

  const selectedCountryObj = availableCountries.find(c => c.id === selectedCountryId);
  const currentCountryLabel = selectedCountryObj 
    ? `${selectedCountryObj.flag} ${selectedCountryObj.name}` 
    : 'All Countries';

  const displayedCountries = availableCountries.filter(c => {
    if (selectedContinent !== 'all' && c.continent !== selectedContinent) {
      return false;
    }
    return true;
  });

  const selectedContinentObj = continents.find(c => c.id === selectedContinent);
  const continentLabel = selectedContinent === 'all' 
    ? `All Continents (${availableCountries.length})` 
    : (selectedContinentObj?.name || selectedContinent);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedContinent !== 'all' || selectedCountryId !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedContinent('all');
    setSelectedCountryId('all');
    setIsContinentDropdownOpen(false);
    setIsCountryDropdownOpen(false);
  };

  return (
    <div className="w-full space-y-3">
      {/* 1. Search Box - Full Width */}
      <div className="relative w-full">
        <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search countries, #1 reigning leaders, or contenders..."
          className={`h-10 sm:h-11 w-full rounded-full border pl-10 pr-10 text-xs sm:text-sm font-lato focus:outline-none transition-all ${
            isDark
              ? 'bg-[#090d14] border-white/15 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-500/20 shadow-xs'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-400 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Filter Pills Row - Only Continents Dropdown and Countries Dropdown */}
      <div className="flex items-center gap-2.5 flex-wrap py-1 relative z-30">
        {/* All Continents Dropdown Pill */}
        <div className="relative" ref={continentRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsContinentDropdownOpen(prev => !prev);
              setIsCountryDropdownOpen(false);
            }}
            className={`h-9 px-4 rounded-full border text-xs font-sora font-semibold flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap active:scale-95 shadow-xs ${
              selectedContinent !== 'all'
                ? isDark
                  ? 'bg-sky-950/80 border-sky-500 text-sky-400'
                  : 'bg-sky-50 border-sky-500 text-sky-700'
                : isDark
                  ? 'bg-[#090d14] hover:bg-[#101622] border-white/15 text-slate-200 hover:border-sky-500/50'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:border-sky-500'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate max-w-[150px]">{continentLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isContinentDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          {/* Floating Continents Menu */}
          {isContinentDropdownOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute left-0 top-full mt-2 w-56 rounded-2xl border py-1.5 z-50 transition-all ${
                isDark
                  ? 'bg-[#090d14] border-white/15 text-slate-200 shadow-2xl shadow-black/90 backdrop-blur-xl'
                  : 'bg-white border-slate-300 text-slate-800 shadow-2xl'
              }`}
            >
              <div className={`px-3.5 py-2 text-[10px] font-mono-terminal uppercase font-bold tracking-wider border-b ${
                isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100'
              }`}>
                Filter by Region / Continent
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {continents.map((c) => {
                  const isSelected = selectedContinent === c.id;
                  const count = continentCounts[c.id] ?? 0;

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedContinent(c.id);
                        setIsContinentDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-xs font-sora text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-sky-950/70 text-sky-400 font-bold'
                            : 'bg-sky-50 text-sky-700 font-bold'
                          : isDark
                            ? 'hover:bg-slate-800/70 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`text-[10px] font-mono-terminal px-1.5 py-0.5 rounded-full border ${
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

        {/* All Countries Dropdown Pill */}
        <div className="relative" ref={countryRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCountryDropdownOpen(prev => !prev);
              setIsContinentDropdownOpen(false);
            }}
            className={`h-9 px-4 rounded-full border text-xs font-sora font-semibold flex items-center gap-2 transition-all cursor-pointer select-none whitespace-nowrap active:scale-95 shadow-xs ${
              selectedCountryId !== 'all'
                ? isDark
                  ? 'bg-sky-950/80 border-sky-500 text-sky-400'
                  : 'bg-sky-50 border-sky-500 text-sky-700'
                : isDark
                  ? 'bg-[#090d14] hover:bg-[#101622] border-white/15 text-slate-200 hover:border-sky-500/50'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:border-sky-500'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate max-w-[150px]">{currentCountryLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          {/* Floating Countries Menu */}
          {isCountryDropdownOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute left-0 top-full mt-2 w-64 rounded-2xl border py-1.5 z-50 transition-all ${
                isDark
                  ? 'bg-[#090d14] border-white/15 text-slate-200 shadow-2xl shadow-black/90 backdrop-blur-xl'
                  : 'bg-white border-slate-300 text-slate-800 shadow-2xl'
              }`}
            >
              <div className={`px-3.5 py-2 text-[10px] font-mono-terminal uppercase font-bold tracking-wider border-b ${
                isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100'
              }`}>
                Select Sovereign Territory ({displayedCountries.length})
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {/* Reset to All Countries */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountryId('all');
                    setIsCountryDropdownOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-xs font-sora text-left flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCountryId === 'all'
                      ? isDark
                        ? 'bg-sky-950/70 text-sky-400 font-bold'
                        : 'bg-sky-50 text-sky-700 font-bold'
                      : isDark
                        ? 'hover:bg-slate-800/70 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>All Countries ({availableCountries.length})</span>
                  {selectedCountryId === 'all' && <Check className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" />}
                </button>

                {displayedCountries.map((country) => {
                  const isSelected = selectedCountryId === country.id;

                  return (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => {
                        setSelectedCountryId(country.id);
                        setIsCountryDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-xs font-sora text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-sky-950/70 text-sky-400 font-bold'
                            : 'bg-sky-50 text-sky-700 font-bold'
                          : isDark
                            ? 'hover:bg-slate-800/70 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-sm">{country.flag}</span>
                        <span className="truncate">{country.name}</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] text-amber-400 font-mono-terminal font-bold">${country.currentBid}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}

                {displayedCountries.length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400 font-lato">
                    No countries matching filters
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reset Filters Button (When any filter or search is active) */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className={`h-9 px-3.5 rounded-full border text-xs font-sora font-semibold flex items-center gap-1.5 transition-colors cursor-pointer select-none whitespace-nowrap active:scale-95 shadow-xs ${
              isDark
                ? 'bg-red-950/40 border-red-800/60 text-red-300 hover:bg-red-900/50'
                : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TerritoryStandingsFilters;
