import React from 'react';
import { ArrowLeft, Globe, DollarSign, Eye, Trophy, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onOpenListingModal: () => void;
  theme?: 'dark' | 'light';
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBack,
  onOpenListingModal,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const steps = [
    {
      num: '1',
      title: 'Pick a Country',
      desc: 'Choose any of the 195 sovereign countries on our 3D globe or directory where you want your product to be seen.'
    },
    {
      num: '2',
      title: 'Place a Bid',
      desc: 'Enter your website URL and place a bid starting at just $1 to claim the #1 spot in that country.'
    },
    {
      num: '3',
      title: 'Get Discovered',
      desc: 'When visitors browse that country, your product is featured at the top with direct links to your site.'
    },
    {
      num: '4',
      title: 'Grow Worldwide',
      desc: 'Bid on multiple countries at the same time to build visibility across different regions and continents.'
    }
  ];

  const highlights = [
    {
      icon: Eye,
      title: '100% Public & Fair',
      desc: 'No secret algorithms, paywalls, or hidden boosts. Rankings are strictly based on open, transparent bids.'
    },
    {
      icon: DollarSign,
      title: 'Starts at Just $1',
      desc: 'Anyone can participate—from indie builders and side projects to growing startups and companies.'
    },
    {
      icon: Trophy,
      title: 'Live Territory Leaderboards',
      desc: 'Every country has its own leaderboard. Outbid the current leader anytime to take the top spot.'
    },
    {
      icon: Globe,
      title: 'Interactive 3D Globe',
      desc: 'Explore real-time ownership across the world map, track live bids, and discover new products daily.'
    }
  ];

  return (
    <div className={`min-h-screen py-8 sm:py-12 px-3 sm:px-6 max-w-4xl mx-auto transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Top Back Navigation Bar - Clean, without Manifesto or List Product */}
      <div className="flex items-center justify-between gap-3 mb-8 sm:mb-12 pb-4 border-b border-inherit">
        <button
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-sora font-bold transition-all cursor-pointer active:scale-95 ${
            isDark
              ? 'bg-[#090d14] hover:bg-[#101622] border-white/15 text-slate-300 hover:text-white'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-mono-terminal font-bold uppercase tracking-wider mb-4 border-sky-500/30 text-sky-400 bg-sky-500/10">
          <Globe className="w-3.5 h-3.5" />
          <span>About Bidly</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-bold font-sora tracking-tight uppercase mb-4 ${
          isDark ? 'text-white' : 'text-slate-950'
        }`}>
          About Bidly
        </h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-sans-pro ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          A simple, transparent marketplace where products compete for visibility across 195 countries on an interactive world map.
        </p>
      </div>

      {/* What is Bidly Section */}
      <div className={`p-6 sm:p-8 rounded-2xl border mb-10 sm:mb-14 ${
        isDark ? 'bg-[#090d14] border-white/15' : 'bg-white border-slate-200'
      }`}>
        <h2 className={`text-lg sm:text-xl font-bold font-sora mb-3 ${isDark ? 'text-white' : 'text-slate-950'}`}>
          What is Bidly?
        </h2>
        <p className={`text-xs sm:text-sm leading-relaxed mb-3 font-sans-pro ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Bidly is an open discovery platform designed to give every creator and company a clear, honest way to get their product in front of real people.
        </p>
        <p className={`text-xs sm:text-sm leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Instead of relying on hidden algorithms or editorial picks, visibility on Bidly is decided through open bidding. When you bid on a country, you compete directly for that territory's top spot.
        </p>
      </div>

      {/* How It Works */}
      <div className="mb-10 sm:mb-14">
        <h2 className={`text-lg sm:text-xl font-bold font-sora mb-5 text-center sm:text-left ${isDark ? 'text-white' : 'text-slate-950'}`}>
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-[#090d14] border-white/15' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="w-7 h-7 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 font-bold font-mono-terminal text-xs flex items-center justify-center mb-3">
                  {s.num}
                </div>
                <h3 className={`font-bold font-sora text-sm mb-1.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {s.title}
                </h3>
                <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Highlights */}
      <div className="mb-10 sm:mb-14">
        <h2 className={`text-lg sm:text-xl font-bold font-sora mb-5 text-center sm:text-left ${isDark ? 'text-white' : 'text-slate-950'}`}>
          Why Bidly?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#090d14] border-white/15' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-sky-950/60 border-sky-800/60 text-sky-400' : 'bg-sky-50 border-sky-300 text-sky-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className={`font-bold font-sora text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {h.title}
                  </h3>
                </div>
                <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {h.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple CTA Box */}
      <div className={`p-6 sm:p-8 rounded-2xl border text-center ${
        isDark ? 'bg-[#090d14] border-sky-500/40' : 'bg-sky-50 border-sky-300'
      }`}>
        <h3 className={`text-xl sm:text-2xl font-bold font-sora mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
          Ready to Get Started?
        </h3>
        <p className={`text-xs sm:text-sm max-w-md mx-auto mb-5 font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Submit your product URL and claim your first country on the live world map starting at $1.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onOpenListingModal}
            className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-sora font-extrabold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 uppercase tracking-wide"
          >
            <span>List Your Product</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
          <button
            onClick={onBack}
            className={`px-5 py-2.5 rounded-full border text-xs font-sora font-bold transition-all cursor-pointer active:scale-95 ${
              isDark ? 'bg-[#05070c] border-white/20 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            Explore Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
