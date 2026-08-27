import React from 'react';

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const rankNum = rank < 10 ? `0${rank}` : `${rank}`;

  if (rank === 1) {
    return (
      <div
        className={`inline-flex items-center justify-center font-alt font-black select-none tracking-wider ${
          size === 'lg'
            ? 'px-3 py-1 text-xs'
            : size === 'md'
            ? 'px-2 py-0.5 text-[11px]'
            : 'px-1.5 py-0.2 text-[9px]'
        } rank-badge-gold ${className}`}
      >
        <span>#{rankNum}</span>
        {showLabel && (
          <span className="text-[8px] uppercase tracking-widest font-sora font-black ml-1 border-l border-black/30 pl-1">
            SUPREME
          </span>
        )}
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div
        className={`inline-flex items-center justify-center font-alt font-black select-none tracking-wider ${
          size === 'lg'
            ? 'px-3 py-1 text-xs'
            : size === 'md'
            ? 'px-2 py-0.5 text-[11px]'
            : 'px-1.5 py-0.2 text-[9px]'
        } rank-badge-silver ${className}`}
      >
        <span>#{rankNum}</span>
        {showLabel && (
          <span className="text-[8px] uppercase tracking-widest font-sora font-black ml-1 border-l border-slate-400 pl-1">
            RUNNER UP
          </span>
        )}
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div
        className={`inline-flex items-center justify-center font-alt font-black select-none tracking-wider ${
          size === 'lg'
            ? 'px-3 py-1 text-xs'
            : size === 'md'
            ? 'px-2 py-0.5 text-[11px]'
            : 'px-1.5 py-0.2 text-[9px]'
        } rank-badge-bronze ${className}`}
      >
        <span>#{rankNum}</span>
        {showLabel && (
          <span className="text-[8px] uppercase tracking-widest font-sora font-black ml-1 border-l border-white/30 pl-1">
            PODIUM
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center font-alt font-bold select-none border border-slate-700 bg-[#07090e]/80 text-slate-300 ${
        size === 'lg'
          ? 'px-2.5 py-1 text-xs'
          : size === 'md'
          ? 'px-2 py-0.5 text-[11px]'
          : 'px-1.5 py-0.2 text-[9px]'
      } ${className}`}
    >
      <span>#{rankNum}</span>
    </div>
  );
};
