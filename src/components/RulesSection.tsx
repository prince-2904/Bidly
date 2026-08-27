import React from 'react';
import { ShieldCheck, CheckCircle2, Scale, Lock, Globe, Swords, Ban } from 'lucide-react';

interface RulesSectionProps {
  theme?: 'dark' | 'light';
}

export const RulesSection: React.FC<RulesSectionProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  const rules = [
    {
      number: '01',
      title: 'Transparent Ranking',
      description: 'Your ranking and visibility are determined purely and mathematically by your bid amount.',
      icon: Scale,
      tag: 'Mathematical'
    },
    {
      number: '02',
      title: 'Every Country Is a Market',
      description: 'Countries operate as independent, sovereign bidding territories with individual leaderboards.',
      icon: Globe,
      tag: 'Sovereign'
    },
    {
      number: '03',
      title: 'Outbid Any Country’s Top Product',
      description: 'Anyone can outbid the top product of any country at any time to claim the #1 territory position immediately.',
      icon: Swords,
      tag: 'Open Outbid'
    },
    {
      number: '04',
      title: 'No Hidden Boosts',
      description: 'There are no secret algorithmic boosts, paid undercover promotions, or backroom editorial deals.',
      icon: Lock,
      tag: 'Zero Slop'
    },
    {
      number: '05',
      title: 'Real Products Only',
      description: 'Products must link to a real, functional, and accessible website with authentic ownership.',
      icon: CheckCircle2,
      tag: 'Verified'
    },
    {
      number: '06',
      title: 'One Product, Global Reach',
      description: 'A single product can compete simultaneously across 10, 20, or all worldwide country markets.',
      icon: Globe,
      tag: 'Multi-Market'
    },
    {
      number: '07',
      title: 'Fair Competition',
      description: 'Automated manipulation, fraudulent carding, synthetic bot traffic, and abusive bidding are strictly prohibited.',
      icon: ShieldCheck,
      tag: 'Integrity'
    },
    {
      number: '08',
      title: 'BidlyTerritory Can Remove Abuse',
      description: 'Malicious listings, phishing websites, and scams that violate community safety will be purged.',
      icon: Ban,
      tag: 'Enforcement'
    }
  ];

  return (
    <div id="bidlyterritory-rules-section" className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md text-xs font-mono-terminal font-bold uppercase tracking-wider mb-3 ${
          isDark
            ? 'bg-sky-950/60 border-sky-800/60 text-sky-400'
            : 'bg-sky-50 border-sky-300 text-sky-800'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Rules of the Bidding Arena</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-black font-sora uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
          EIGHT IMMUTABLE RULES
        </h2>
        <p className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Eight foundational laws governing the open territory bidding platform. Anyone can outbid the top product of any country at any time.
        </p>
      </div>

      {/* 8 Rules Grid - Slight Glass Rounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {rules.map((rule) => {
          return (
            <div
              key={rule.number}
              className={`p-4 rounded-xl border backdrop-blur-md transition-all flex items-start gap-3.5 shadow-xs ${
                isDark
                  ? 'bg-[#0d1117]/80 border-[#1e2638] hover:border-sky-500/40'
                  : 'bg-white/80 border-slate-200 hover:border-sky-500'
              }`}
            >
              <div className="flex flex-col items-center shrink-0">
                <span className={`font-mono-terminal font-bold text-xs px-2.5 py-1 rounded-full border backdrop-blur-md ${
                  isDark
                    ? 'bg-sky-950/80 text-sky-400 border-sky-800'
                    : 'bg-sky-50 text-sky-800 border-sky-300'
                }`}>
                  {rule.number}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`font-bold font-sora text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {rule.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono-terminal font-bold uppercase border backdrop-blur-md ${
                    isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {rule.tag}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed font-sans-pro ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {rule.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
