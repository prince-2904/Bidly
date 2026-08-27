import React from 'react';
import { ArrowLeft, ShieldCheck, Scale, Globe, Swords, CheckCircle2, DollarSign, Layers, ArrowRight } from 'lucide-react';

interface RulesPageProps {
  onBack: () => void;
  onOpenListingModal: () => void;
  theme?: 'dark' | 'light';
}

export const RulesPage: React.FC<RulesPageProps> = ({
  onBack,
  onOpenListingModal,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const rules = [
    {
      number: '1',
      title: 'Highest Bid Leads',
      description: 'The product with the highest bid holds the #1 spot in that country.',
      icon: Scale,
      tag: 'Bidding'
    },
    {
      number: '2',
      title: 'Anyone Can Outbid',
      description: 'Any country can be claimed by placing a bid higher than the current leader at any time.',
      icon: Swords,
      tag: 'Open Market'
    },
    {
      number: '3',
      title: '195 Independent Countries',
      description: 'Every country has its own separate leaderboard and bid price.',
      icon: Globe,
      tag: 'Territories'
    },
    {
      number: '4',
      title: 'Real Products Only',
      description: 'Every submission must link to a real, working website, app, or tool with valid ownership.',
      icon: CheckCircle2,
      tag: 'Verification'
    },
    {
      number: '5',
      title: '$1 Minimum Bid',
      description: 'Bidding starts at $1. Outbidding requires at least $1 more than the current top bid.',
      icon: DollarSign,
      tag: 'Pricing'
    },
    {
      number: '6',
      title: 'Multiple Countries',
      description: 'You can bid on and hold multiple countries at the same time to increase your reach.',
      icon: Layers,
      tag: 'Global Reach'
    },
    {
      number: '7',
      title: 'Instant Live Updates',
      description: 'All bids, rankings, and ownership changes appear immediately across the platform.',
      icon: ShieldCheck,
      tag: 'Real-Time'
    },
    {
      number: '8',
      title: 'Safety & Fair Play',
      description: 'Spam, malware, scams, or illegal content will be removed immediately without a refund.',
      icon: ShieldCheck,
      tag: 'Fair Play'
    }
  ];

  return (
    <div className={`min-h-screen py-8 sm:py-12 px-3 sm:px-6 max-w-4xl mx-auto transition-colors duration-200 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Top Back Navigation Bar - Clean, without Platform Laws or List Product */}
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

      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-mono-terminal font-bold uppercase tracking-wider mb-4 border-sky-500/30 text-sky-400 bg-sky-500/10">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Guidelines</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-bold font-sora tracking-tight uppercase mb-4 ${
          isDark ? 'text-white' : 'text-slate-950'
        }`}>
          Rules
        </h1>
        <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-sans-pro ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Simple, fair, and transparent guidelines for all participants on Bidly.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 sm:mb-14">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.number}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-[#090d14] border-white/15' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 font-bold font-mono-terminal text-xs flex items-center justify-center">
                      {rule.number}
                    </span>
                    <Icon className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-terminal font-bold uppercase border ${
                    isDark ? 'bg-[#05070c] border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {rule.tag}
                  </span>
                </div>

                <h3 className={`font-bold font-sora text-sm mb-1.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {rule.title}
                </h3>
                <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {rule.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple CTA Box */}
      <div className={`p-6 sm:p-8 rounded-2xl border text-center ${
        isDark ? 'bg-[#090d14] border-sky-500/40' : 'bg-sky-50 border-sky-300'
      }`}>
        <h3 className={`text-xl sm:text-2xl font-bold font-sora mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
          Ready to Bid?
        </h3>
        <p className={`text-xs sm:text-sm max-w-md mx-auto mb-5 font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Join the open discovery arena and claim sovereign countries on the world map starting at $1.
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

export default RulesPage;
