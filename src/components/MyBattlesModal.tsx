import React from 'react';
import { Product, CountryMarket } from '../types';
import { X, Trophy, Plus, Sparkles, AlertCircle } from 'lucide-react';

interface MyBattlesModalProps {
  myProducts: Product[];
  countries: CountryMarket[];
  onClose: () => void;
  onOpenListingModal: () => void;
  onSelectCountryById: (countryId: string) => void;
  theme?: 'dark' | 'light';
}

export const MyBattlesModal: React.FC<MyBattlesModalProps> = ({
  myProducts,
  countries,
  onClose,
  onOpenListingModal,
  onSelectCountryById,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 animate-fadeIn">
      <div
        id="my-battles-modal-card"
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

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4 pr-8">
          <div className={`p-2.5 rounded-full border backdrop-blur-md ${
            isDark ? 'bg-sky-950/60 text-sky-400 border-sky-800' : 'bg-sky-50 text-sky-800 border-sky-300'
          }`}>
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-xl font-bold font-sora tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-950'}`}>
              MY BATTLE CHEST
            </h2>
            <p className={`text-[11px] font-mono-terminal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Track your listed products and defend territory placements against hostile outbids.
            </p>
          </div>
        </div>

        {myProducts.length > 0 ? (
          <div className="space-y-3">
            {myProducts.map(prod => {
              const won = countries.filter(c => c.currentWinnerProductId === prod.id);

              return (
                <div key={prod.id} className={`p-4 rounded-xl border backdrop-blur-md space-y-2.5 ${
                  isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div
                      onClick={(e) => openProductSite(e, prod.url, prod.domain)}
                      className="flex items-center gap-2.5 cursor-pointer group"
                      title={`Visit ${prod.name}`}
                    >
                      <img
                        src={prod.logoUrl}
                        alt={prod.name}
                        className={`w-9 h-9 rounded-full object-cover border group-hover:ring-2 group-hover:ring-sky-400 transition-all ${isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-white'}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(prod.name)}&background=0ea5e9&color=fff`;
                        }}
                      />
                      <div>
                        <h3 className={`font-bold font-sora text-sm group-hover:text-sky-400 group-hover:underline transition-colors ${isDark ? 'text-white' : 'text-slate-950'}`}>{prod.name}</h3>
                        <span className="text-[11px] text-sky-400 font-mono-terminal">{prod.domain}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono-terminal">
                      <div className="text-[9px] text-slate-400 uppercase">War Chest</div>
                      <div className="text-base font-black text-amber-400 font-alt">${prod.totalGlobalBid}</div>
                    </div>
                  </div>

                  {/* Territories Owned */}
                  <div className="border-t border-inherit pt-2">
                    <div className="text-[11px] font-sora font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <span>Territories: {won.length}</span>
                      <span className="text-slate-400 dark:text-slate-500">•</span>
                    </div>
                    {won.length > 0 ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {won.map(c => (
                          <button
                            key={c.id}
                            onClick={() => {
                              onClose();
                              onSelectCountryById(c.id);
                            }}
                            className={`px-3 py-1 rounded-full border backdrop-blur-md text-xs font-mono-terminal flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                              isDark
                                ? 'bg-[#07090e]/80 hover:bg-slate-800 border-slate-800 text-slate-200'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            <span>{c.flag}</span>
                            <span className="font-bold">{c.name}</span>
                            <span className="text-amber-400 font-alt">(${c.currentBid})</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400 font-mono-terminal flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Currently outbid in all territories. Bid more to reclaim visibility!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`p-6 rounded-xl border border-dashed backdrop-blur-md text-center space-y-2 ${
            isDark ? 'bg-[#0d1117]/80 border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}>
            <Sparkles className="w-6 h-6 text-slate-500 mx-auto" />
            <h3 className={`text-sm font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>No active listings yet</h3>
            <p className={`text-xs max-w-xs mx-auto font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Submit your product URL to claim your first sovereign country starting at $1.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenListingModal();
              }}
              className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs inline-flex items-center gap-1 shadow-md backdrop-blur-md cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>List Product ($1)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
