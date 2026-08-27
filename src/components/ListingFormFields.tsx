import React from 'react';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';

interface ListingFormFieldsProps {
  url: string;
  setUrl: (url: string) => void;
  name: string;
  setName: (name: string) => void;
  tagline: string;
  setTagline: (tagline: string) => void;
  logoUrl: string;
  setLogoUrl: (logo: string) => void;
  domain: string;
  makerName?: string;
  setMakerName?: (name: string) => void;
  makerEmail?: string;
  setMakerEmail?: (email: string) => void;
  isFetchingUrl: boolean;
  onScrapeUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  theme?: 'dark' | 'light';
}

export const ListingFormFields: React.FC<ListingFormFieldsProps> = ({
  url,
  setUrl,
  name,
  setName,
  tagline,
  setTagline,
  logoUrl,
  setLogoUrl,
  domain,
  isFetchingUrl,
  onScrapeUrl,
  onSubmit,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Live URL Scrape Box */}
      <div className="space-y-1">
        <label className={`text-[11px] font-mono-terminal uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Product Website URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (url.trim()) onScrapeUrl(url);
              }
            }}
            placeholder="https://yourproduct.com"
            className={`flex-1 rounded-full border px-4 py-2 text-xs focus:outline-none font-sans-pro ${
              isDark
                ? 'bg-[#07090e]/80 border-[#1e2638] text-white focus:border-sky-500'
                : 'bg-white border-slate-300 text-slate-900 focus:border-sky-600'
            }`}
          />
          <button
            type="button"
            onClick={() => onScrapeUrl(url)}
            disabled={isFetchingUrl || !url.trim()}
            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            <span>Fetch Data</span>
          </button>
        </div>
      </div>

      {/* Collectible Preview Card */}
      <div className={`p-4 rounded-xl border backdrop-blur-md relative ${
        isDark ? 'bg-[#0d1117]/80 border-sky-500/40' : 'bg-slate-50 border-sky-600 shadow-xs'
      }`}>
        <div className="flex items-start gap-3">
          <img
            src={logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'}
            alt="Logo"
            className={`w-12 h-12 rounded-full object-cover border shrink-0 ${isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-white'}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'BidlyTerritory')}&background=0ea5e9&color=fff`;
            }}
          />

          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold font-sora ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {name || 'Your Product Name'}
            </h3>
            <div className="text-[11px] font-mono-terminal text-sky-400">
              {domain || 'yourdomain.com'}
            </div>
            <p className={`text-xs mt-1 line-clamp-1 font-sans-pro ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {tagline || 'High-performance software product competing for global discovery.'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-inherit flex items-center justify-between text-[11px] font-mono-terminal">
          <span>Entry Bid: <strong className="text-sky-400 font-alt">$1</strong></span>
          <span className="text-slate-400">Territory War Ready</span>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans-pro">
        <div className="space-y-0.5">
          <label className={`text-[10px] font-mono-terminal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Product Title</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme AI"
            required
            className={`w-full rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${
              isDark ? 'bg-[#07090e]/80 border-[#1e2638] text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>

        <div className="space-y-0.5">
          <label className={`text-[10px] font-mono-terminal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Logo / Icon URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://... logo.png"
            className={`w-full rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${
              isDark ? 'bg-[#07090e]/80 border-[#1e2638] text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>

        <div className="sm:col-span-2 space-y-0.5">
          <label className={`text-[10px] font-mono-terminal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Short Pitch / Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Autonomous workflow engine for modern engineering teams"
            className={`w-full rounded-xl border px-3 py-1.5 text-xs focus:outline-none ${
              isDark ? 'bg-[#07090e]/80 border-[#1e2638] text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-3 border-t border-inherit flex justify-end">
        <button
          id="modal-continue-to-bidding-btn"
          type="submit"
          className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md cursor-pointer active:scale-95 uppercase tracking-wide"
        >
          <span>Continue to Territories</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </form>
  );
};
