import React from 'react';
import { RotateCw, ZoomIn, ZoomOut, Globe as GlobeIcon } from 'lucide-react';

interface GlobeMapControlsProps {
  totalClaimed: number;
  totalCountries: number;
  zoomLevelState: number;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isDark: boolean;
}

export const GlobeMapControls: React.FC<GlobeMapControlsProps> = ({
  totalClaimed,
  totalCountries,
  zoomLevelState,
  onResetView,
  onZoomIn,
  onZoomOut,
  isDark
}) => {
  return (
    <>
      {/* Top Left: Claimed Stat Pill */}
      <div className="absolute top-2.5 left-3 z-20 flex items-center gap-1.5 flex-wrap justify-start pointer-events-auto">
        <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-lato font-bold flex items-center gap-1.5 ${
          isDark
            ? 'bg-[#090d14]/95 border-white/15 text-sky-400'
            : 'bg-white/95 border-slate-300 text-sky-700'
        }`}>
          <GlobeIcon className="w-2.5 h-2.5 text-sky-400 shrink-0" />
          <span>{totalClaimed} / {totalCountries} CLAIMED</span>
        </div>

        {zoomLevelState > 1.2 && (
          <div className={`hidden sm:flex px-2 py-0.5 rounded-full border text-[8.5px] font-mono-terminal items-center gap-1 ${
            isDark ? 'bg-[#090d14]/95 border-white/15 text-slate-400' : 'bg-white/95 border-slate-300 text-slate-600'
          }`}>
            <span>ZOOM {zoomLevelState.toFixed(1)}x</span>
          </div>
        )}
      </div>

      {/* Floating Map Action Controls */}
      <div
        id="map-controls-group"
        className={`absolute bottom-2.5 right-3 z-20 flex items-center gap-1 p-0.5 rounded-full border pointer-events-auto ${
          isDark
            ? 'bg-[#090d14]/95 border-white/15'
            : 'bg-white/95 border-slate-300'
        }`}
      >
        {/* Reset Orientation & Zoom */}
        <button
          id="map-reset-view"
          onClick={onResetView}
          title="Reset Map View"
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
          }`}
        >
          <RotateCw className="w-2.5 h-2.5" />
        </button>

        <div className={`h-2.5 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

        {/* Zoom In */}
        <button
          id="map-zoom-in"
          onClick={onZoomIn}
          title="Zoom In"
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
          }`}
        >
          <ZoomIn className="w-2.5 h-2.5" />
        </button>

        {/* Zoom Out */}
        <button
          id="map-zoom-out"
          onClick={onZoomOut}
          title="Zoom Out"
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
          }`}
        >
          <ZoomOut className="w-2.5 h-2.5" />
        </button>
      </div>
    </>
  );
};
