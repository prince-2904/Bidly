import React, { useState, useMemo } from 'react';
import { CountryMarket, Product } from '../types';
import { Globe, Search } from 'lucide-react';
import { TerritoryStandingsCard } from './TerritoryStandingsCard';
import { TerritoryStandingsFilters } from './TerritoryStandingsFilters';

interface TerritoryStandingsSectionProps {
  countries: CountryMarket[];
  products: Product[];
  onSelectCountry: (country: CountryMarket) => void;
  onSelectProduct: (product: Product) => void;
  onOpenListingModalForCountry: (countryId: string) => void;
  theme?: 'dark' | 'light';
}

const CONTINENTS = [
  { id: 'all', name: 'All Continents' },
  { id: 'North America', name: 'North America' },
  { id: 'Europe', name: 'Europe' },
  { id: 'Asia', name: 'Asia' },
  { id: 'South America', name: 'South America' },
  { id: 'Africa', name: 'Africa' },
  { id: 'Oceania', name: 'Oceania' },
];

export const TerritoryStandingsSection: React.FC<TerritoryStandingsSectionProps> = ({
  countries,
  products,
  onSelectCountry,
  onSelectProduct,
  onOpenListingModalForCountry,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('all');
  const [isContinentDropdownOpen, setIsContinentDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Only occupied / claimed countries
  const claimedCountries = useMemo(() => {
    return countries.filter(c => Boolean(c.currentWinnerProductId));
  }, [countries]);

  // Product lookup helper
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach(p => map.set(p.id, p));
    return map;
  }, [products]);

  // Filtered & Sorted claimed countries
  const filteredCountries = useMemo(() => {
    return claimedCountries.filter(c => {
      if (selectedCountryId !== 'all' && c.id !== selectedCountryId) {
        return false;
      }
      if (selectedContinent !== 'all' && c.continent !== selectedContinent) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCountry = c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
        const matchesWinner = c.currentWinnerProductName?.toLowerCase().includes(query) || c.currentWinnerTagline?.toLowerCase().includes(query);
        const matchesContenders = c.activeContenders?.some(cont => cont.productName.toLowerCase().includes(query));
        
        if (!matchesCountry && !matchesWinner && !matchesContenders) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => b.currentBid - a.currentBid);
  }, [claimedCountries, selectedContinent, selectedCountryId, searchQuery]);

  // Total stakes across claimed
  const totalStakes = useMemo(() => {
    return claimedCountries.reduce((acc, c) => acc + c.currentBid, 0);
  }, [claimedCountries]);

  // Derive Top 3 Bidders for a country
  const getTopThreeBidders = (country: CountryMarket) => {
    const list: {
      productId: string;
      productName: string;
      productLogo: string;
      bidAmount: number;
      bidAt?: string;
    }[] = [];

    // Reigning winner
    if (country.currentWinnerProductId) {
      list.push({
        productId: country.currentWinnerProductId,
        productName: country.currentWinnerProductName || 'Dominant Product',
        productLogo: country.currentWinnerProductLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(country.currentWinnerProductName || 'Product')}&background=0ea5e9&color=fff`,
        bidAmount: country.currentBid,
        bidAt: country.lastBidAt
      });
    }

    // Active contenders
    if (country.activeContenders && country.activeContenders.length > 0) {
      country.activeContenders.forEach(cont => {
        if (!list.some(item => item.productId === cont.productId)) {
          list.push({
            productId: cont.productId,
            productName: cont.productName,
            productLogo: cont.productLogo,
            bidAmount: cont.bidAmount,
            bidAt: cont.bidAt
          });
        }
      });
    }

    // Bids history fallback
    if (country.bidsHistory && country.bidsHistory.length > 0) {
      country.bidsHistory.forEach(b => {
        if (!list.some(item => item.productId === b.productId)) {
          list.push({
            productId: b.productId,
            productName: b.productName,
            productLogo: b.productLogo,
            bidAmount: b.amount,
            bidAt: b.timestamp
          });
        }
      });
    }

    list.sort((a, b) => b.bidAmount - a.bidAmount);
    return list.slice(0, 3);
  };

  return (
    <section id="territory-standings-section" className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-8">
      {/* Section Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Globe className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="text-[11px] font-mono-terminal font-bold uppercase tracking-wider text-sky-400 font-sora">
            Territorial Sovereignty Ledger
          </span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-black font-sora tracking-tight uppercase ${
          isDark ? 'text-white' : 'text-slate-950'
        }`}>
          WHO RULES EACH TERRITORY
        </h2>
        <p className={`text-xs sm:text-sm mt-1 max-w-xl font-lato ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Live visibility ranking across all occupied sovereign nations. See the reigning #1 product and their top 3 contenders.
        </p>
      </div>

      {/* Modern Filter & Search Toolbar */}
      <div className="mb-6">
        <TerritoryStandingsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedContinent={selectedContinent}
          setSelectedContinent={setSelectedContinent}
          selectedCountryId={selectedCountryId}
          setSelectedCountryId={setSelectedCountryId}
          isContinentDropdownOpen={isContinentDropdownOpen}
          setIsContinentDropdownOpen={setIsContinentDropdownOpen}
          isCountryDropdownOpen={isCountryDropdownOpen}
          setIsCountryDropdownOpen={setIsCountryDropdownOpen}
          continents={CONTINENTS}
          availableCountries={claimedCountries}
          filteredCount={filteredCountries.length}
          totalClaimedCount={claimedCountries.length}
          totalCountriesCount={countries.length || 195}
          theme={theme}
        />
      </div>

      {/* Territory Cards Grid */}
      {filteredCountries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCountries.map((country) => {
            const topThree = getTopThreeBidders(country);
            const winnerProduct = country.currentWinnerProductId ? productMap.get(country.currentWinnerProductId) : null;

            return (
              <TerritoryStandingsCard
                key={country.id}
                country={country}
                winnerProduct={winnerProduct}
                topThree={topThree}
                productMap={productMap}
                onSelectCountry={onSelectCountry}
                onSelectProduct={onSelectProduct}
                onOpenListingModalForCountry={onOpenListingModalForCountry}
                theme={theme}
              />
            );
          })}
        </div>
      ) : (
        <div className={`p-10 rounded-2xl border text-center ${
          isDark ? 'bg-[#090d14] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className={`font-sora font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No sovereign territories matched your criteria
          </h3>
          <p className="text-xs text-slate-400 font-lato mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Continents", or clearing the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedContinent('all');
            }}
            className="mt-3 px-4 py-1.5 rounded-full bg-sky-500 text-black font-sora font-bold text-xs cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default TerritoryStandingsSection;
