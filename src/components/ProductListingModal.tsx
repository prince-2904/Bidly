import React, { useState, useEffect } from 'react';
import { CountryMarket, ScrapedMetadata, Product } from '../types';
import { X, Check, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ListingFormFields } from './ListingFormFields';
import { ListingCountrySelector } from './ListingCountrySelector';

export interface ListingModalSavedState {
  step?: 'details' | 'battlefield' | 'checkout' | 'success';
  url?: string;
  name?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  domain?: string;
  makerName?: string;
  makerEmail?: string;
  selectedBids?: Record<string, number>;
}

interface ProductListingModalProps {
  initialUrl?: string;
  initialSelectedCountryId?: string;
  scrapedData: ScrapedMetadata | null;
  countries: CountryMarket[];
  savedState?: ListingModalSavedState | null;
  onSaveState?: (state: ListingModalSavedState) => void;
  onClose: () => void;
  onSuccess: (newProduct: Product, claimedCountries: string[]) => void;
  onViewRules?: () => void;
  theme?: 'dark' | 'light';
}

export const ProductListingModal: React.FC<ProductListingModalProps> = ({
  initialUrl = '',
  initialSelectedCountryId,
  scrapedData,
  countries,
  savedState,
  onSaveState,
  onClose,
  onSuccess,
  onViewRules,
  theme = 'dark'
}) => {
  const [step, setStep] = useState<'details' | 'battlefield' | 'checkout' | 'success'>(
    savedState?.step || 'details'
  );
  const isDark = theme === 'dark';

  // Product Form State
  const [url, setUrl] = useState(savedState?.url ?? initialUrl);
  const [name, setName] = useState(savedState?.name ?? '');
  const [tagline, setTagline] = useState(savedState?.tagline ?? '');
  const [description, setDescription] = useState(savedState?.description ?? '');
  const [logoUrl, setLogoUrl] = useState(savedState?.logoUrl ?? '');
  const [domain, setDomain] = useState(savedState?.domain ?? '');
  const [makerName, setMakerName] = useState(savedState?.makerName ?? '');
  const [makerEmail, setMakerEmail] = useState(savedState?.makerEmail ?? '');

  // Battlefield Selections: countryId -> bidAmount
  const [selectedBids, setSelectedBids] = useState<Record<string, number>>(
    savedState?.selectedBids ?? {}
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initial population from scrapedData if no savedState
  useEffect(() => {
    if (savedState) return;
    if (scrapedData) {
      setUrl(scrapedData.url || '');
      setDomain(scrapedData.domain || '');
      setName(scrapedData.extractedName || scrapedData.title || '');
      setTagline(scrapedData.ogDescription || scrapedData.description || '');
      setDescription(scrapedData.description || '');
      setLogoUrl(scrapedData.logo || scrapedData.favicon || `https://www.google.com/s2/favicons?domain=${scrapedData.domain}&sz=128`);
    } else if (initialUrl) {
      handleScrapeUrl(initialUrl);
    }
  }, [scrapedData, initialUrl, savedState]);

  useEffect(() => {
    if (savedState?.selectedBids && Object.keys(savedState.selectedBids).length > 0) return;
    if (initialSelectedCountryId) {
      const country = countries.find(c => c.id === initialSelectedCountryId);
      if (country) {
        setSelectedBids(prev => ({
          ...prev,
          [country.id]: country.minNextBid
        }));
      }
    } else if (Object.keys(selectedBids).length === 0 && countries.length > 0) {
      const defaultCountry = countries[0];
      setSelectedBids({ [defaultCountry.id]: defaultCountry.minNextBid });
    }
  }, [initialSelectedCountryId, countries, savedState]);

  const handleScrapeUrl = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsFetchingUrl(true);
    setErrorMessage('');
    const formatted = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') 
      ? targetUrl 
      : `https://${targetUrl}`;

    try {
      const res = await fetch('/api/scrape-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formatted })
      });
      if (res.ok) {
        const data: ScrapedMetadata = await res.json();
        setUrl(data.url);
        setDomain(data.domain);
        setName(data.extractedName || data.title);
        setTagline(data.ogDescription || data.description);
        setDescription(data.description);
        setLogoUrl(data.logo || data.favicon || `https://www.google.com/s2/favicons?domain=${data.domain}&sz=128`);
      } else {
        const parsedHost = new URL(formatted).hostname.replace(/^www\./, '');
        const cleanName = parsedHost.split('.')[0];
        const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setUrl(formatted);
        setDomain(parsedHost);
        setName(capitalized);
        setTagline(`${capitalized} — modern digital product`);
        setDescription(`${capitalized} is built for high-performance developer and user workflows.`);
        setLogoUrl(`https://www.google.com/s2/favicons?domain=${parsedHost}&sz=128`);
      }
    } catch {
      try {
        const parsedHost = new URL(formatted).hostname.replace(/^www\./, '');
        const cleanName = parsedHost.split('.')[0];
        const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setUrl(formatted);
        setDomain(parsedHost);
        setName(capitalized);
        setTagline(`${capitalized} — modern digital product`);
        setDescription(`${capitalized} is built for high-performance developer and user workflows.`);
        setLogoUrl(`https://www.google.com/s2/favicons?domain=${parsedHost}&sz=128`);
      } catch {
        // Fallback
      }
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const toggleCountry = (country: CountryMarket) => {
    setSelectedBids(prev => {
      const next = { ...prev };
      if (next[country.id]) {
        delete next[country.id];
      } else {
        next[country.id] = country.minNextBid;
      }
      return next;
    });
  };

  const updateCountryBid = (countryId: string, amount: number) => {
    const country = countries.find(c => c.id === countryId);
    if (!country) return;
    setSelectedBids(prev => ({
      ...prev,
      [countryId]: Math.max(country.minNextBid, amount)
    }));
  };

  const totalBidAmount = (Object.values(selectedBids) as number[]).reduce((sum: number, val: number) => sum + Number(val || 0), 0);
  const selectedCount = Object.keys(selectedBids).length;
  const selectedCountriesList = countries.filter(c => !!selectedBids[c.id]);

  const handleProceedToBattlefield = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter a product name');
      return;
    }
    setStep('battlefield');
  };

  const handleProceedToCheckout = () => {
    if (selectedCount === 0) {
      setErrorMessage('Please select at least 1 country territory');
      return;
    }
    setStep('checkout');
  };

  const handleFinalPaymentAndBidding = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const selectedCountriesPayload = Object.entries(selectedBids).map(([countryId, bidAmount]) => ({
        countryId,
        bidAmount
      }));

      const res = await fetch('/api/bids/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: name,
          productDomain: domain || (url ? new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace(/^www\./, '') : 'example.com'),
          productUrl: url.startsWith('http') ? url : 'https://' + url,
          productLogo: logoUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          productTagline: tagline || `${name} — High Performance Platform`,
          productDescription: description,
          selectedCountries: selectedCountriesPayload,
          bidderName: makerName || 'Verified Maker',
          bidderEmail: makerEmail,
          paymentMethod: 'dodopayments',
          currency: 'USD'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to complete bidding transaction');
      }

      const data = await res.json();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep('success');
      setTimeout(() => {
        onSuccess(data.product, Object.keys(selectedBids));
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 animate-fadeIn">
      <div
        id="product-listing-modal-container"
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 transition-all shadow-2xl ${
          isDark
            ? 'bg-[#090d14] border-white/15 text-white shadow-black/90'
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
            isDark ? 'bg-[#0d1117] hover:bg-slate-800 border-[#1e2638] text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Wizard Steps Navigation */}
        <div className="flex items-center justify-between border-b border-inherit pb-3 mb-4 pr-8">
          <div>
            <span className="text-[9px] font-mono-terminal font-bold text-sky-400 uppercase tracking-widest font-sora">
              BIDLY ARENA
            </span>
            <h2 className={`text-lg sm:text-xl font-black font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {step === 'details' && 'Step 1: Product Verification'}
              {step === 'battlefield' && 'Step 2: Choose Target Territories'}
              {step === 'checkout' && 'Step 3: Secure Territory Acquisition'}
              {step === 'success' && 'Territory Outbid & Claimed!'}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono-terminal">
            <span className={`px-2.5 py-0.5 rounded-full border ${step === 'details' ? 'bg-sky-500 text-black font-extrabold border-sky-400' : 'text-slate-400 border-transparent'}`}>
              01. Info
            </span>
            <span className="text-slate-400">→</span>
            <span className={`px-2.5 py-0.5 rounded-full border ${step === 'battlefield' ? 'bg-sky-500 text-black font-extrabold border-sky-400' : 'text-slate-400 border-transparent'}`}>
              02. Territories
            </span>
            <span className="text-slate-400">→</span>
            <span className={`px-2.5 py-0.5 rounded-full border ${step === 'checkout' ? 'bg-sky-500 text-black font-extrabold border-sky-400' : 'text-slate-400 border-transparent'}`}>
              03. Payment
            </span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl border border-rose-800 bg-rose-950/80 text-rose-300 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PRODUCT DETAILS & PREVIEW */}
        {step === 'details' && (
          <ListingFormFields
            url={url}
            setUrl={setUrl}
            name={name}
            setName={setName}
            tagline={tagline}
            setTagline={setTagline}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            domain={domain}
            makerName={makerName}
            setMakerName={setMakerName}
            makerEmail={makerEmail}
            setMakerEmail={setMakerEmail}
            isFetchingUrl={isFetchingUrl}
            onScrapeUrl={handleScrapeUrl}
            onSubmit={handleProceedToBattlefield}
            theme={theme}
          />
        )}

        {/* STEP 2: CHOOSE YOUR BATTLEFIELD */}
        {step === 'battlefield' && (
          <ListingCountrySelector
            countries={countries}
            selectedBids={selectedBids}
            toggleCountry={toggleCountry}
            updateCountryBid={updateCountryBid}
            onBack={() => setStep('details')}
            onProceedToCheckout={handleProceedToCheckout}
            totalBidAmount={totalBidAmount}
            selectedCount={selectedCount}
            theme={theme}
          />
        )}

        {/* STEP 3: CHECKOUT */}
        {step === 'checkout' && (
          <div className="space-y-4">
            {/* DodoPayments Gateway Redirect Notice Box */}
            <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
              isDark ? 'bg-[#0d1117]/90 border-sky-500/40 text-white' : 'bg-sky-50/70 border-sky-400 text-slate-900 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sora font-bold text-xs uppercase tracking-wider text-sky-400">
                  DodoPayments Gateway
                </span>
              </div>
              <p className={`text-xs font-sans-pro leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                You will be securely redirected to <strong>DodoPayments Gateway</strong> to complete your territory acquisition once you click the button below.
              </p>
            </div>

            {/* Bidding Summary Invoice */}
            <div className={`p-3.5 rounded-xl border backdrop-blur-md font-mono-terminal text-xs space-y-2.5 ${
              isDark ? 'bg-[#07090e]/80 border-[#1e2638]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-inherit pb-2">
                <span className="text-slate-400">Product:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</span>
              </div>
              <div className="flex items-start justify-between border-b border-inherit pb-2 gap-2">
                <span className="text-slate-400 shrink-0">Territories Count:</span>
                <div className="flex items-center gap-1.5 flex-wrap justify-end text-right">
                  <span className="text-sky-400 font-bold">{selectedCount} {selectedCount === 1 ? 'Country' : 'Countries'}</span>
                  <span className="text-sm flex items-center gap-1">
                    {selectedCountriesList.map(c => (
                      <span key={c.id} title={c.name} className="cursor-default">{c.flag}</span>
                    ))}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-0.5 text-xs font-bold">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>Total Amount:</span>
                <span className="text-sky-400 text-sm font-alt">
                  ${totalBidAmount} USD
                </span>
              </div>
            </div>

            {/* Fair Gameplay Rules Note */}
            <div className={`p-3 rounded-xl border backdrop-blur-md text-xs leading-relaxed ${
              isDark ? 'bg-[#0d1117]/80 border-sky-900/40 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'
            }`}>
              <span>
                <strong>Fair Gameplay:</strong> Your position is live instantly upon payment. If another maker outbids your spot in the future, your product moves to the contenders ledger or you can reclaim it anytime. Read our{' '}
                <button
                  type="button"
                  onClick={() => {
                    onSaveState?.({
                      step: 'checkout',
                      url,
                      name,
                      tagline,
                      description,
                      logoUrl,
                      domain,
                      makerName,
                      makerEmail,
                      selectedBids
                    });
                    onViewRules?.();
                  }}
                  className="text-sky-400 font-bold underline hover:text-sky-300 cursor-pointer inline"
                >
                  Platform Rules
                </button>
                .
              </span>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-inherit flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('battlefield')}
                disabled={isProcessing}
                className={`px-4 py-1.5 rounded-full font-sora font-extrabold text-[9.5px] tracking-wide flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer disabled:opacity-50 active:scale-95 uppercase border ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                    : 'bg-black/5 hover:bg-black/10 border-slate-300 text-slate-700'
                }`}
              >
                <ArrowLeft className="w-2.5 h-2.5 stroke-[3]" />
                <span>Back</span>
              </button>

              <button
                id="modal-confirm-bids-and-pay-btn"
                type="button"
                onClick={handleFinalPaymentAndBidding}
                disabled={isProcessing}
                className="px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-[9.5px] tracking-wide flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer disabled:opacity-50 active:scale-95 uppercase"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-black" />
                    <span>Redirecting to DodoPayments...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to DodoPayments (${totalBidAmount})</span>
                    <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CLAIM */}
        {step === 'success' && (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full border border-sky-500 text-sky-400 flex items-center justify-center mx-auto backdrop-blur-md bg-sky-500/10">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h3 className={`text-xl font-black font-sora uppercase ${isDark ? 'text-white' : 'text-slate-950'}`}>
              TERRITORY OUTBID & CLAIMED!
            </h3>
            <p className={`text-xs max-w-sm mx-auto font-sans-pro ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong>{name}</strong> is now the #1 top product across your selected markets. Updating globe and leaderboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListingModal;
