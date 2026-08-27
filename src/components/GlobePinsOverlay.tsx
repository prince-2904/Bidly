import React from 'react';
import { CountryMarket } from '../types';
import { Plus } from 'lucide-react';

interface ProjectedCountry {
  country: CountryMarket;
  baseX: number;
  baseY: number;
}

interface GlobePinsOverlayProps {
  projectedCountries: ProjectedCountry[];
  pillRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  selectedCountry: CountryMarket | null;
  hoveredCountryId: string | null;
  setHoveredCountryId: (id: string | null) => void;
  onSelectCountry: (country: CountryMarket) => void;
  hasMovedRef: React.MutableRefObject<boolean>;
  zoomLevelState: number;
  isDark: boolean;
  mapFilter?: 'all' | 'claimed' | 'unclaimed';
}

export const GlobePinsOverlay: React.FC<GlobePinsOverlayProps> = ({
  projectedCountries,
  pillRefs,
  selectedCountry,
  hoveredCountryId,
  setHoveredCountryId,
  onSelectCountry,
  hasMovedRef,
  zoomLevelState,
  isDark,
  mapFilter = 'all'
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {projectedCountries.map(({ country: c }) => {
        const isClaimed = !!c.currentWinnerProductId;
        if (mapFilter === 'claimed' && !isClaimed) return null;
        if (mapFilter === 'unclaimed' && isClaimed) return null;

        const isSelected = selectedCountry?.id === c.id;
        const isHovered = hoveredCountryId === c.id;
        const showExpandedDetails = isSelected || isHovered || zoomLevelState >= 1.35;
        const showDeepDetails = isSelected || isHovered || zoomLevelState >= 2.6;

        return (
          <div
            key={c.id}
            ref={(el) => { pillRefs.current[c.id] = el; }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
              zIndex: isSelected ? 40 : isClaimed ? 25 : 15
            }}
            className="pointer-events-auto cursor-pointer flex flex-col items-center group select-none country-pill-btn"
            onMouseEnter={() => setHoveredCountryId(c.id)}
            onMouseLeave={() => setHoveredCountryId(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (!hasMovedRef.current) {
                onSelectCountry(c);
              }
            }}
          >
            {/* Acquired Territory Pill */}
            {isClaimed ? (
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-lato whitespace-nowrap border shadow-xs transition-transform duration-100 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#0a0f18] border-sky-400 text-white ring-1 ring-sky-400/80 scale-105'
                      : 'bg-white border-sky-500 text-slate-950 ring-1 ring-sky-500/80 scale-105'
                    : isDark
                      ? 'bg-[#080c14]/95 group-hover:bg-[#0e1422] border-white/20 group-hover:border-sky-400/70 text-slate-200'
                      : 'bg-white/95 group-hover:bg-white border-slate-300 group-hover:border-sky-500/70 text-slate-800'
                }`}
              >
                <span className="text-[10px] leading-none shrink-0">{c.flag}</span>

                <div className="flex items-center gap-1">
                  {c.currentWinnerProductLogo && (
                    <img
                      src={c.currentWinnerProductLogo}
                      alt={c.currentWinnerProductName || ''}
                      className="w-2.5 h-2.5 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.currentWinnerProductName || '')}&background=0ea5e9&color=fff`;
                      }}
                    />
                  )}
                  <span className={`font-sora font-medium text-[9px] truncate ${showDeepDetails ? 'max-w-[90px]' : showExpandedDetails ? 'max-w-[65px]' : 'max-w-[45px]'} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {c.currentWinnerProductName}
                  </span>
                  <span className="text-slate-400 text-[8px]">·</span>
                  <span className="font-sora font-bold text-[9px] text-sky-400">
                    ${c.currentBid}
                  </span>
                </div>
              </div>
            ) : (
              /* Unclaimed Country Pill */
              <div
                title={`Claim ${c.name} for $1`}
                className={`flex items-center justify-center rounded-full border shadow-xs transition-transform duration-100 ${
                  showExpandedDetails
                    ? isDark
                      ? 'px-1.5 py-0.5 gap-1 bg-[#0a0f18] border-sky-400 text-sky-300 ring-1 ring-sky-400/80'
                      : 'px-1.5 py-0.5 gap-1 bg-white border-sky-500 text-sky-700 ring-1 ring-sky-500/80'
                    : isDark
                      ? 'w-4 h-4 bg-[#080c14]/90 group-hover:bg-[#0e1422] border-white/20 group-hover:border-sky-400 text-slate-300 group-hover:text-white'
                      : 'w-4 h-4 bg-white/95 group-hover:bg-white border-slate-300 group-hover:border-sky-500 text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {showExpandedDetails ? (
                  <>
                    <span className="text-[9.5px] leading-none shrink-0">{c.flag}</span>
                    <span className="font-sora font-semibold text-[8.5px] truncate max-w-[60px]">{c.name}</span>
                    <span className="text-slate-400 text-[7.5px]">·</span>
                    <span className="font-sora font-bold text-[8.5px] text-sky-400">$1</span>
                  </>
                ) : (
                  <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                )}
              </div>
            )}

            {/* Leader Needle Stem */}
            <div className="flex flex-col items-center pointer-events-none">
              <div className={`w-0.5 h-1.5 ${
                isSelected
                  ? 'bg-sky-400'
                  : isClaimed
                    ? isDark ? 'bg-sky-400/70' : 'bg-sky-600/70'
                    : isDark ? 'bg-slate-500/60' : 'bg-slate-400/60'
              }`} />
              <div className={`w-1 h-1 rounded-full ${
                isSelected
                  ? 'bg-sky-400 ring-1 ring-sky-400/80'
                  : isClaimed
                    ? isDark ? 'bg-sky-400' : 'bg-sky-600'
                    : isDark ? 'bg-slate-400' : 'bg-slate-500'
              }`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
