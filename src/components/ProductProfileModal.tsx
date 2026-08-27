import React from 'react';
import { Product, CountryMarket } from '../types';
import { X, ExternalLink, Trophy, Plus } from 'lucide-react';

interface ProductProfileModalProps {
  product: Product;
  countries: CountryMarket[];
  onClose: () => void;
  onSelectCountryById: (countryId: string) => void;
  onBidForTerritory: (product: Product) => void;
  theme?: 'dark' | 'light';
}

export const ProductProfileModal: React.FC<ProductProfileModalProps> = ({
  product,
  countries,
  onClose,
  onSelectCountryById,
  onBidForTerritory,
  theme = 'dark'
}) => {
  const wonCountries = countries.filter(c => c.currentWinnerProductId === product.id);
  const isDark = theme === 'dark';

  const openProductSite = (e: React.MouseEvent, url?: string, domain?: string) => {
    e.stopPropagation();
    const targetUrl = url || (domain ? `https://${domain.replace(/^https?:\/\//, '')}` : undefined);
    if (targetUrl) {
      window.open(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 animate-fadeIn">
      <div
        id="product-profile-modal-card"
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 transition-all shadow-2xl ${
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

        {/* Product Brand Header */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          <img
            src={product.logoUrl}
            alt={product.name}
            onClick={(e) => openProductSite(e, product.url, product.domain)}
            className={`w-12 h-12 rounded-full object-cover border shrink-0 cursor-pointer hover:ring-2 hover:ring-sky-400 transition-all ${isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-white'}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=0ea5e9&color=fff`;
            }}
            title={`Visit ${product.name}`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <div
                onClick={(e) => openProductSite(e, product.url, product.domain)}
                className="cursor-pointer group flex items-center gap-1"
                title={`Visit ${product.name}`}
              >
                <h2 className={`text-xl font-bold font-sora group-hover:text-sky-400 group-hover:underline transition-colors ${isDark ? 'text-white' : 'text-slate-950'}`}>{product.name}</h2>
                <ExternalLink className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <button
                type="button"
                onClick={(e) => openProductSite(e, product.url, product.domain)}
                className={`text-[10px] font-mono-terminal px-2.5 py-0.5 rounded-full border cursor-pointer hover:bg-sky-500 hover:text-black transition-colors ${
                  isDark ? 'bg-slate-900/80 text-sky-400 border-slate-800' : 'bg-slate-100 text-sky-700 border-slate-200'
                }`}
              >
                {product.domain}
              </button>
            </div>
            <p className={`text-xs mt-0.5 font-sans-pro ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {product.tagline}
            </p>
            {product.ownerName && (
              <div className="text-[10px] text-slate-400 font-mono-terminal mt-0.5">
                Maker: {product.ownerName}
              </div>
            )}
          </div>
        </div>

        {/* Global War Chest Statistics Grid - Slight Glass Round */}
        <div className={`grid grid-cols-3 gap-2 p-3 rounded-xl border backdrop-blur-md font-mono-terminal text-center mb-4 ${
          isDark ? 'bg-[#07090e]/80 border-[#1e2638]' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Global Bid Total</div>
            <div className="text-base sm:text-lg font-black text-amber-400 font-alt">${product.totalGlobalBid}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Countries Won</div>
            <div className="text-base sm:text-lg font-black text-sky-400 font-alt">{wonCountries.length}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">Status</div>
            <div className={`text-xs font-bold uppercase mt-0.5 font-sora ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Bidder</div>
          </div>
        </div>

        {/* Claimed Territories Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-mono-terminal font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-sora">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Reigning Territories ({wonCountries.length})</span>
            </h3>
          </div>

          {wonCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {wonCountries.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    onClose();
                    onSelectCountryById(c.id);
                  }}
                  className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all flex items-center justify-between group ${
                    isDark
                      ? 'bg-[#0d1117]/80 hover:bg-[#111622] border-[#1e2638] hover:border-sky-500/40'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-sky-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <div className={`font-sora font-bold text-xs group-hover:text-sky-400 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {c.name}
                      </div>
                      <div className="text-[9px] text-sky-400 font-mono-terminal font-bold">
                        #1 Sovereign Leader
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-alt font-black text-amber-400 text-xs">
                      ${c.currentBid}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono-terminal">
                      Next: ${c.minNextBid}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-4 rounded-xl border border-dashed backdrop-blur-md text-center ${
              isDark ? 'bg-[#0d1117]/80 border-slate-800' : 'bg-slate-50 border-slate-300'
            }`}>
              <p className="text-xs text-slate-400 font-sans-pro">
                This product currently holds no #1 territory placements. Outbid competitors below!
              </p>
            </div>
          )}
        </div>

        {/* Detailed Pitch - Slight Glass Round */}
        {product.description && (
          <div className={`mb-4 p-3.5 rounded-xl border backdrop-blur-md ${
            isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-[10px] font-mono-terminal text-slate-400 uppercase mb-0.5">About Product:</div>
            <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {product.description}
            </p>
          </div>
        )}

        {/* Action Buttons - Glass Pills */}
        <div className="pt-3 border-t border-inherit flex flex-col sm:flex-row items-center justify-between gap-2">
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className={`w-full sm:w-auto px-4 py-2 rounded-full border backdrop-blur-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              isDark ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
            }`}
          >
            <span>Visit Official Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              onClose();
              onBidForTerritory(product);
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Bid for Another Country</span>
          </button>
        </div>
      </div>
    </div>
  );
};
