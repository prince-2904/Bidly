import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenListingModal?: () => void;
  onOpenMyProductsModal?: () => void;
  onNavigateHome?: () => void;
  myProductsCount?: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenListingModal,
  onOpenMyProductsModal,
  myProductsCount = 0,
  theme,
  onToggleTheme,
  onNavigateHome,
}) => {
  const isDark = theme === 'dark';
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  useEffect(() => {
    // Generate or get persistent visitor session token
    let visitorId = '';
    try {
      visitorId = sessionStorage.getItem('bidly_visitor_id') || localStorage.getItem('bidly_visitor_id') || '';
      if (!visitorId) {
        visitorId = 'vis-' + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem('bidly_visitor_id', visitorId);
        localStorage.setItem('bidly_visitor_id', visitorId);
      }
    } catch {
      visitorId = 'vis-temp-' + Math.random().toString(36).substring(2, 10);
    }

    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/visitors/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.count && typeof data.count === 'number') {
            setVisitorCount(prev => {
              if (prev !== data.count) {
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 800);
              }
              return data.count;
            });
          }
        }
      } catch {
        // Keep actual baseline fallback
        setVisitorCount(prev => Math.max(1, prev));
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`sticky top-0 w-full border-b transition-colors duration-200 backdrop-blur-xl z-40 ${
      isDark
        ? 'bg-[#07090e]/60 border-white/10 text-slate-100'
        : 'bg-white/70 border-slate-200/80 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between">
        {/* Brand Text */}
        <button
          id="brand-logo-btn"
          type="button"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center select-none cursor-pointer group text-left active:scale-95 transition-transform"
        >
          <span className={`font-bold font-sora text-xl sm:text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
            <span className="text-sky-500">.</span>Bid<span className="text-sky-500">ly</span>
          </span>
        </button>

        {/* Header Actions: Compact Live Visitors Pill & iOS Liquid Glass Light/Dark Switch */}
        <div className="flex items-center gap-2.5">
          {/* Compact Live Visitor Pill */}
          <div
            id="live-visitors-badge"
            className={`h-8 px-3 rounded-full border backdrop-blur-md flex items-center gap-2 text-[11px] font-mono-terminal select-none transition-all duration-300 shadow-xs ${
              isPulsing ? 'scale-105 border-emerald-500/50' : ''
            } ${
              isDark
                ? 'bg-[#0d121c]/90 border-white/10 text-slate-300'
                : 'bg-white/90 border-slate-200 text-slate-700'
            }`}
            title="Real-time live active visitors and bidders across 195 nations"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold font-sora text-[11px] tracking-tight flex items-center">
              <span className="text-emerald-400 font-bold font-alt tabular-nums">
                {visitorCount.toLocaleString()}
              </span>
              <span className="ml-1 text-slate-400 hidden sm:inline">
                {visitorCount === 1 ? 'Live Visitor' : 'Live Visitors'}
              </span>
            </span>
          </div>

          {/* iOS Liquid Glass Theme Switch */}
          <button
            id="theme-toggle-btn"
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
        </div>
      </div>
    </header>
  );
};

