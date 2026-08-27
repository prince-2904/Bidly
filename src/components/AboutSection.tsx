import React from 'react';
import { BookOpen, Scale, Cpu, Eye, Sparkles, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenListingModal: () => void;
  theme?: 'dark' | 'light';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenListingModal, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div id="about-manifesto-section" className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-10 sm:py-14">
      {/* Badge & Title */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md text-xs font-mono-terminal font-bold uppercase tracking-wider mb-3 ${
          isDark
            ? 'bg-sky-950/60 border-sky-800/60 text-sky-400'
            : 'bg-sky-50 border-sky-300 text-sky-800'
        }`}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>The BidlyTerritory Manifesto</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold font-sora uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
          A TRANSPARENT DISCOVERY ENGINE
        </h2>
        <p className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Replacing opaque algorithmic feeds with mathematical, transparent market mechanics.
        </p>
      </div>

      {/* Core Principles Grid - Slight Glass Rounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md space-y-2 shadow-xs ${
          isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-white/80 border-slate-200 shadow-xs'
        }`}>
          <div className={`w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center ${
            isDark ? 'bg-sky-950/60 border-sky-800/60 text-sky-400' : 'bg-sky-50 border-sky-300 text-sky-800'
          }`}>
            <Eye className="w-4 h-4" />
          </div>
          <h3 className={`text-sm sm:text-base font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Absolute Visibility Transparency
          </h3>
          <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            There are no shadow algorithms deciding who gets impressions. No editorial favoritism or undisclosed boosts. What you bid is where you rank.
          </p>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md space-y-2 shadow-xs ${
          isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-white/80 border-slate-200 shadow-xs'
        }`}>
          <div className={`w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center ${
            isDark ? 'bg-sky-950/60 border-sky-800/60 text-sky-400' : 'bg-sky-50 border-sky-300 text-sky-800'
          }`}>
            <Scale className="w-4 h-4" />
          </div>
          <h3 className={`text-sm sm:text-base font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
            A Pure Mathematical Marketplace
          </h3>
          <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            BidlyTerritory treats online visibility as an open sovereign auction. Bid more for a territory, rank higher within that nation's discovery feed.
          </p>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md space-y-2 shadow-xs ${
          isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-white/80 border-slate-200 shadow-xs'
        }`}>
          <div className={`w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center ${
            isDark ? 'bg-amber-950/60 border-amber-800/60 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className={`text-sm sm:text-base font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Accessible to Every Maker ($1 Entry)
          </h3>
          <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Listing starts at just $1. Side projects, indie hackers, and hypergrowth startups compete on the exact same transparent global stage.
          </p>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md space-y-2 shadow-xs ${
          isDark ? 'bg-[#0d1117]/80 border-[#1e2638]' : 'bg-white/80 border-slate-200 shadow-xs'
        }`}>
          <div className={`w-8 h-8 rounded-full border backdrop-blur-md flex items-center justify-center ${
            isDark ? 'bg-indigo-950/60 border-indigo-800/60 text-indigo-400' : 'bg-indigo-50 border-indigo-300 text-indigo-800'
          }`}>
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className={`text-sm sm:text-base font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Multi-Territory Bidding Strategy
          </h3>
          <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Target prime tech hubs like the United States and India, or acquire strategic visibility across Europe, Asia, and Latin America simultaneously.
          </p>
        </div>
      </div>

      {/* Call to action box - Slight Glass Round & Glass Pill Button */}
      <div className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-md text-center relative overflow-hidden shadow-xl ${
        isDark
          ? 'bg-[#0d1117]/85 border-sky-500/40 shadow-sky-500/5'
          : 'bg-sky-50/70 border-sky-400 shadow-sm'
      }`}>
        <h3 className={`text-xl sm:text-2xl font-black font-sora mb-1.5 uppercase ${isDark ? 'text-white' : 'text-slate-950'}`}>
          Ready to claim your territory on the world globe?
        </h3>
        <p className={`text-xs sm:text-sm max-w-md mx-auto mb-5 font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Paste your website URL, select your target countries, and instantly compete for global discovery.
        </p>
        <button
          onClick={onOpenListingModal}
          className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs inline-flex items-center gap-2 border border-sky-400 backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-95 uppercase tracking-wide"
        >
          <span>List Product — Starts at $1</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
