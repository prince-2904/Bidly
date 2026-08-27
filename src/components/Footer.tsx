import React from 'react';
import { Plus, Heart, Sun, Moon } from 'lucide-react';

interface FooterProps {
  onOpenListingModal: () => void;
  onNavigate?: (view: 'home' | 'about' | 'rules') => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenListingModal, 
  onNavigate, 
  theme = 'dark',
  onToggleTheme 
}) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t py-6 sm:py-8 text-xs transition-colors duration-200 ${
      isDark
        ? 'bg-[#05070b] border-[#1e2638] text-slate-400'
        : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        {/* Brand Name Text in Center */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className={`font-bold font-sora text-xl sm:text-2xl tracking-tight cursor-pointer inline-flex items-center gap-2 active:scale-95 transition-transform ${isDark ? 'text-white' : 'text-slate-950'}`}
          >
            <span><span className="text-sky-500">.</span>Bid<span className="text-sky-500">ly</span></span>
          </button>
        </div>

        {/* 1-Line Description */}
        <p className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Transparent territory bidding for global software discovery.
        </p>

        {/* Enter War CTA & Theme Switch in Footer */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onOpenListingModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ENTER WAR</span>
          </button>

          {/* iOS Liquid Glass Theme Switch in Footer */}
          {onToggleTheme && (
            <button
              id="footer-theme-toggle-btn"
              role="switch"
              aria-checked={isDark}
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              className={`relative flex items-center h-8 w-14 p-1 rounded-full border backdrop-blur-md transition-colors duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 active:scale-95 ${
                isDark
                  ? 'bg-[#0b101b]/80 border-white/15'
                  : 'bg-slate-200/90 border-slate-300'
              }`}
            >
              {/* Sliding Liquid Glass Indicator */}
              <div
                className={`absolute top-1 bottom-1 w-6 rounded-full border transition-transform duration-200 cubic-bezier(0.4, 0, 0.2, 1) will-change-transform transform-gpu ${
                  isDark
                    ? 'translate-x-6 bg-sky-500/20 border-sky-400/50 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                    : 'translate-x-0 bg-white border-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                }`}
              />

              {/* Sun Icon (Light Mode Target) */}
              <div className="relative z-10 w-6 h-6 flex items-center justify-center pointer-events-none">
                <Sun
                  className={`w-3.5 h-3.5 transition-colors duration-150 ${
                    !isDark ? 'text-amber-500 stroke-[2.4]' : 'text-slate-500 stroke-[1.8]'
                  }`}
                />
              </div>

              {/* Moon Icon (Dark Mode Target) */}
              <div className="relative z-10 w-6 h-6 flex items-center justify-center pointer-events-none">
                <Moon
                  className={`w-3.5 h-3.5 transition-colors duration-150 ${
                    isDark ? 'text-sky-300 stroke-[2.4]' : 'text-slate-400 stroke-[1.8]'
                  }`}
                />
              </div>
            </button>
          )}
        </div>

        {/* Dedicated Pages Navigation Links: Pure clean text links with NO top border */}
        <div className="flex items-center justify-center gap-4 text-xs font-sora pt-1">
          <button
            onClick={() => onNavigate && onNavigate('about')}
            className={`transition-colors cursor-pointer hover:underline hover:text-sky-400 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            About
          </button>
          <span className="text-slate-600 dark:text-slate-700">•</span>
          <button
            onClick={() => onNavigate && onNavigate('rules')}
            className={`transition-colors cursor-pointer hover:underline hover:text-sky-400 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Rules
          </button>
        </div>

        {/* Made with love by @priiincegupta */}
        <div className={`pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 font-mono-terminal text-[11px] ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}>
          <span className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-sky-500 fill-sky-500" />
            <span>by</span>
            <a
              href="https://x.com/priiincegupta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 font-bold hover:underline"
            >
              @priiincegupta
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
