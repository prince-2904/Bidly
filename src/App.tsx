import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { TerritoryStandingsSection } from './components/TerritoryStandingsSection';
import { TerritoriesExplorer } from './components/TerritoriesExplorer';
import { AboutPage } from './components/AboutPage';
import { RulesPage } from './components/RulesPage';
import { CountryMarketModal } from './components/CountryMarketModal';
import { ProductListingModal, ListingModalSavedState } from './components/ProductListingModal';
import { ProductProfileModal } from './components/ProductProfileModal';
import { MyBattlesModal } from './components/MyBattlesModal';
import { Footer } from './components/Footer';

import { CountryMarket, Product, LiveActivityItem, ScrapedMetadata } from './types';
import { INITIAL_COUNTRIES, INITIAL_PRODUCTS, INITIAL_ACTIVITIES } from './data/initialData';
import { Globe as GlobeIcon, Loader2, Swords } from 'lucide-react';

// Code Splitting: Lazy load the 3D WebGL Globe to ensure instant main UI rendering
const Globe3D = lazy(() => import('./components/Globe3D'));

// Fast, sharp Skeleton Fallback matching exact height to prevent layout shift
const GlobeSkeleton: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`relative w-full h-[220px] sm:h-[250px] md:h-[280px] rounded-2xl border flex flex-col items-center justify-center select-none transition-colors duration-200 backdrop-blur-md ${
      isDark
        ? 'bg-[#06080e]/80 border-[#1e2638] text-slate-400'
        : 'bg-[#f1f5f9]/80 border-[#cbd5e1] text-slate-600'
    }`}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <GlobeIcon className="w-8 h-8 text-sky-500 animate-spin" style={{ animationDuration: '10s' }} />
          <Loader2 className="w-4 h-4 text-sky-400 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div className="text-center">
          <div className={`font-sora font-bold text-xs tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-950'}`}>
            INITIALIZING MAP
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bidly_theme') || localStorage.getItem('bidatlas_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('bidly_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Dedicated Page Views Navigation State ('home' | 'about' | 'rules')
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'rules'>('home');

  // Core Data
  const [countries, setCountries] = useState<CountryMarket[]>(INITIAL_COUNTRIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activities, setActivities] = useState<LiveActivityItem[]>(INITIAL_ACTIVITIES);
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  // Modals & Panels
  const [selectedCountry, setSelectedCountry] = useState<CountryMarket | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isMyBattlesOpen, setIsMyBattlesOpen] = useState(false);

  // Map Territory View Filter ('all' | 'claimed' | 'unclaimed') - Default to 'claimed'
  const [mapFilter, setMapFilter] = useState<'all' | 'claimed' | 'unclaimed'>('claimed');

  // Listing Flow State
  const [targetUrlForListing, setTargetUrlForListing] = useState('');
  const [presetCountryIdForListing, setPresetCountryIdForListing] = useState<string | undefined>(undefined);
  const [scrapedMetadata, setScrapedMetadata] = useState<ScrapedMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [savedListingModalState, setSavedListingModalState] = useState<ListingModalSavedState | null>(null);
  const [returnToModalAfterRules, setReturnToModalAfterRules] = useState(false);

  // Fetch initial data from server APIs
  const fetchAllData = useCallback(async () => {
    try {
      const [cRes, pRes, aRes] = await Promise.all([
        fetch('/api/countries'),
        fetch('/api/products'),
        fetch('/api/activity'),
      ]);

      if (cRes.ok) {
        const cData = await cRes.json();
        setCountries(cData);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setActivities(aData);
      }
    } catch {
      // Fallback already in initial state
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Handle URL submission from Hero Section
  const handleHeroUrlSubmit = async (rawUrl: string) => {
    const formattedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') 
      ? rawUrl 
      : `https://${rawUrl}`;

    setTargetUrlForListing(formattedUrl);
    setIsLoadingMetadata(true);

    try {
      const res = await fetch('/api/scrape-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setScrapedMetadata(data);
      } else {
        const parsedHost = new URL(formattedUrl).hostname.replace(/^www\./, '');
        const cleanName = parsedHost.split('.')[0];
        const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setScrapedMetadata({
          url: formattedUrl,
          domain: parsedHost,
          title: capitalized,
          extractedName: capitalized,
          tagline: `${capitalized} — modern digital product`,
          logo: `https://www.google.com/s2/favicons?domain=${parsedHost}&sz=128`,
          favicon: `https://www.google.com/s2/favicons?domain=${parsedHost}&sz=128`,
          description: `${capitalized} is built for high-performance developer and user workflows.`,
          category: 'Software',
        });
      }
    } catch {
      try {
        const parsedHost = new URL(formattedUrl).hostname.replace(/^www\./, '');
        const cleanName = parsedHost.split('.')[0];
        const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setScrapedMetadata({
          url: formattedUrl,
          domain: parsedHost,
          title: capitalized,
          extractedName: capitalized,
          tagline: `${capitalized} — modern digital product`,
          logo: `https://www.google.com/s2/favicons?domain=${parsedHost}&sz=128`,
          favicon: `https://www.google.com/s2/favicons?domain=${parsedHost}&sz=128`,
          description: `${capitalized} is built for high-performance developer and user workflows.`,
          category: 'Software',
        });
      } catch {
        setScrapedMetadata({
          url: formattedUrl,
          domain: 'product.app',
          title: 'My Product',
          extractedName: 'My Product',
          tagline: 'Modern online product.',
          logo: 'https://ui-avatars.com/api/?name=Product&background=0ea5e9&color=fff',
          description: 'A cutting-edge platform engineered for high impact.',
          category: 'Software',
        });
      }
    } finally {
      setIsLoadingMetadata(false);
      setIsListingModalOpen(true);
    }
  };

  // Open listing modal manually
  const handleOpenListingModal = (presetCountryId?: string) => {
    setTargetUrlForListing('');
    setScrapedMetadata(null);
    setPresetCountryIdForListing(presetCountryId);
    setSavedListingModalState(null);
    setReturnToModalAfterRules(false);
    setIsListingModalOpen(true);
  };

  // Handle successful bidding / outbid & claim
  const handleListingSuccess = (newProduct: Product, _claimedCountries?: string[]) => {
    setIsListingModalOpen(false);
    setSelectedCountry(null);
    fetchAllData();

    setMyProducts(prev => {
      const exists = prev.some(p => p.id === newProduct.id);
      if (exists) {
        return prev.map(p => p.id === newProduct.id ? newProduct : p);
      }
      return [newProduct, ...prev];
    });
  };

  // Trigger Outbid flow directly from Country Modal
  const handlePlaceBidForCountry = (country: CountryMarket) => {
    setSelectedCountry(null);
    setPresetCountryIdForListing(country.id);
    setIsListingModalOpen(true);
  };

  // Trigger product profile view
  const handleViewProductById = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  // Trigger select country by ID
  const handleSelectCountryById = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const navigateTo = (view: 'home' | 'about' | 'rules') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = theme === 'dark';
  const claimedCount = countries.filter(c => c.currentWinnerProductId !== null).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#07090e] text-slate-100' : 'bg-slate-50 text-slate-900'
    } selection:bg-sky-500 selection:text-black`}>
      {/* Top Main Navigation Header */}
      <Header
        onOpenListingModal={() => handleOpenListingModal()}
        onOpenMyProductsModal={() => setIsMyBattlesOpen(true)}
        onNavigateHome={() => navigateTo('home')}
        myProductsCount={myProducts.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Dynamic View Routing: Home vs Dedicated Pages */}
      <main className="flex-1 w-full">
        {currentView === 'about' ? (
          <AboutPage
            onBack={() => navigateTo('home')}
            onOpenListingModal={() => handleOpenListingModal()}
            theme={theme}
          />
        ) : currentView === 'rules' ? (
          <RulesPage
            onBack={() => {
              navigateTo('home');
              if (returnToModalAfterRules) {
                setIsListingModalOpen(true);
                setReturnToModalAfterRules(false);
              }
            }}
            onOpenListingModal={() => {
              setSavedListingModalState(null);
              setReturnToModalAfterRules(false);
              handleOpenListingModal();
            }}
            theme={theme}
          />
        ) : (
          /* Main Single-Page Discovery Flow */
          <div className="space-y-8 sm:space-y-12">
            {/* Hero Section with Live URL Input */}
            <HeroSection
              onSubmitUrl={handleHeroUrlSubmit}
              isLoadingMetadata={isLoadingMetadata}
              activities={activities}
              countries={countries}
              onSelectCountry={(c) => setSelectedCountry(c)}
              theme={theme}
            />

            {/* Interactive World Globe Section */}
            <section id="globe-section" className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Swords className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="text-[11px] font-mono-terminal font-bold uppercase tracking-wider text-sky-400 font-sora">
                        Live Strategic War Zone
                      </span>
                    </div>
                    <h2 className={`text-xl sm:text-2xl font-black font-sora uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      THE GLOBAL DISCOVERY MAP
                    </h2>
                    <p className={`text-xs sm:text-sm font-lato mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Pan, zoom and click any country territory on the live interactive map to inspect bids & outbid the top product
                    </p>
                  </div>
                </div>

                {/* Map Territory Filter 3-Way Segmented Pill Button (Centered with Equal Left & Right Margins & Wider Horizontal Length) */}
                <div className="w-full flex justify-center items-center mt-3.5 sm:mt-4">
                  <div
                    role="tablist"
                    aria-label="Map territory filters"
                    className={`inline-flex items-center p-1 rounded-full border shadow-xs transition-colors ${
                      isDark ? 'bg-[#0a0e17] border-[#1e2638]' : 'bg-slate-200/80 border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      role="tab"
                      id="map-filter-all-btn"
                      aria-selected={mapFilter === 'all'}
                      onClick={() => setMapFilter('all')}
                      className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-sora font-semibold transition-all duration-150 cursor-pointer min-w-[96px] sm:min-w-[124px] ${
                        mapFilter === 'all'
                          ? 'bg-sky-500 text-black shadow-xs font-bold'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
                      }`}
                    >
                      <span>All</span>
                      <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full tabular-nums font-mono-terminal font-bold ${
                        mapFilter === 'all'
                          ? 'bg-black/20 text-black'
                          : isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-300/80 text-slate-700'
                      }`}>
                        {countries.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      id="map-filter-claimed-btn"
                      aria-selected={mapFilter === 'claimed'}
                      onClick={() => setMapFilter('claimed')}
                      className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-sora font-semibold transition-all duration-150 cursor-pointer min-w-[104px] sm:min-w-[136px] ${
                        mapFilter === 'claimed'
                          ? 'bg-sky-500 text-black shadow-xs font-bold'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
                      }`}
                    >
                      <span>Claimed</span>
                      <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full tabular-nums font-mono-terminal font-bold ${
                        mapFilter === 'claimed'
                          ? 'bg-black/20 text-black'
                          : isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-300/80 text-slate-700'
                      }`}>
                        {claimedCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      id="map-filter-unclaimed-btn"
                      aria-selected={mapFilter === 'unclaimed'}
                      onClick={() => setMapFilter('unclaimed')}
                      className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-sora font-semibold transition-all duration-150 cursor-pointer min-w-[108px] sm:min-w-[144px] ${
                        mapFilter === 'unclaimed'
                          ? 'bg-sky-500 text-black shadow-xs font-bold'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
                      }`}
                    >
                      <span>Unclaimed</span>
                      <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full tabular-nums font-mono-terminal font-bold ${
                        mapFilter === 'unclaimed'
                          ? 'bg-black/20 text-black'
                          : isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-300/80 text-slate-700'
                      }`}>
                        {countries.length - claimedCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Code-Split 3D WebGL Three.js Globe with Suspense Fallback */}
              <Suspense fallback={<GlobeSkeleton theme={theme} />}>
                <Globe3D
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onSelectCountry={(c) => setSelectedCountry(c)}
                  theme={theme}
                  claimedCount={claimedCount}
                  mapFilter={mapFilter}
                />
              </Suspense>
            </section>

            {/* Territorial Standings: Country Leaders & Top 3 Contenders Ledger */}
            <TerritoryStandingsSection
              countries={countries}
              products={products}
              onSelectCountry={(c) => setSelectedCountry(c)}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenListingModalForCountry={(cId) => handleOpenListingModal(cId)}
              theme={theme}
            />

            {/* Global Leaderboard Section: Official Global Standings */}
            <GlobalLeaderboard
              products={products}
              countries={countries}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onSelectCountryById={handleSelectCountryById}
              onOpenListingModal={(c) => handleOpenListingModal(c?.id)}
              theme={theme}
            />

            {/* Sovereign Territories Directory */}
            <TerritoriesExplorer
              countries={countries}
              onSelectCountry={(c) => setSelectedCountry(c)}
              onOpenListingModal={() => handleOpenListingModal()}
              theme={theme}
            />
          </div>
        )}
      </main>

      {/* Country Market Detail Modal */}
      {selectedCountry && (
        <CountryMarketModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onPlaceBidForCountry={handlePlaceBidForCountry}
          onViewProduct={handleViewProductById}
          theme={theme}
        />
      )}

      {/* Product Submission & Multi-Territory Bidding Modal */}
      {isListingModalOpen && (
        <ProductListingModal
          initialUrl={targetUrlForListing}
          initialSelectedCountryId={presetCountryIdForListing}
          scrapedData={scrapedMetadata}
          countries={countries}
          savedState={savedListingModalState}
          onSaveState={(state) => setSavedListingModalState(state)}
          onClose={() => {
            setIsListingModalOpen(false);
            setPresetCountryIdForListing(undefined);
            setSavedListingModalState(null);
            setReturnToModalAfterRules(false);
          }}
          onSuccess={(newProduct, claimedCountries) => {
            handleListingSuccess(newProduct, claimedCountries);
            setSavedListingModalState(null);
            setReturnToModalAfterRules(false);
          }}
          onViewRules={() => {
            setIsListingModalOpen(false);
            setReturnToModalAfterRules(true);
            navigateTo('rules');
          }}
          theme={theme}
        />
      )}

      {/* Dedicated Product Profile Modal */}
      {selectedProduct && (
        <ProductProfileModal
          product={selectedProduct}
          countries={countries}
          onClose={() => setSelectedProduct(null)}
          onSelectCountryById={handleSelectCountryById}
          onBidForTerritory={() => {
            setSelectedProduct(null);
            handleOpenListingModal();
          }}
          theme={theme}
        />
      )}

      {/* My Battles Chest Modal */}
      {isMyBattlesOpen && (
        <MyBattlesModal
          myProducts={myProducts}
          countries={countries}
          onClose={() => setIsMyBattlesOpen(false)}
          onOpenListingModal={() => {
            setIsMyBattlesOpen(false);
            handleOpenListingModal();
          }}
          onSelectCountryById={(cId) => {
            setIsMyBattlesOpen(false);
            handleSelectCountryById(cId);
          }}
          theme={theme}
        />
      )}

      {/* Minimal Centered Footer with Navigation Links & Theme Switch */}
      <Footer
        onOpenListingModal={() => handleOpenListingModal()}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
