import React from 'react';
import { CountryMarket } from '../types';

interface RenderedPolygon {
  id: string | number;
  pathData: string;
  matchedCountry?: CountryMarket;
}

interface GlobePolygonsLayerProps {
  renderedPolygons: RenderedPolygon[];
  graticulePath: string | null;
  hoveredCountryId: string | null;
  selectedCountry: CountryMarket | null;
  setHoveredCountryId: (id: string | null) => void;
  onSelectCountry: (country: CountryMarket) => void;
  hasMovedRef: React.MutableRefObject<boolean>;
  isDark: boolean;
}

export const GlobePolygonsLayer: React.FC<GlobePolygonsLayerProps> = ({
  renderedPolygons,
  graticulePath,
  hoveredCountryId,
  selectedCountry,
  setHoveredCountryId,
  onSelectCountry,
  hasMovedRef,
  isDark
}) => {
  return (
    <>
      {/* Precision Graticule Lines */}
      {graticulePath && (
        <path
          d={graticulePath}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="2 3"
        />
      )}

      {/* Sovereign Land Boundaries & Polygons */}
      {renderedPolygons.map(({ id, pathData, matchedCountry }) => {
        const isHovered = matchedCountry && hoveredCountryId === matchedCountry.id;
        const isSelected = matchedCountry && selectedCountry && selectedCountry.id === matchedCountry.id;
        const isClaimed = matchedCountry && matchedCountry.currentWinnerProductId !== null;

        let fillColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(241, 245, 249, 0.95)';
        let strokeColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(203, 213, 225, 0.9)';
        let strokeWidth = '0.5';

        if (isClaimed) {
          fillColor = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.12)';
          strokeColor = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(2, 132, 199, 0.6)';
          strokeWidth = '0.9';
        }

        if (isHovered) {
          fillColor = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.26)';
          strokeColor = isDark ? 'rgba(56, 189, 248, 0.95)' : 'rgba(2, 132, 199, 0.95)';
        }

        if (isSelected) {
          fillColor = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)';
          strokeColor = isDark ? '#38bdf8' : '#0284c7';
          strokeWidth = '1.5';
        }

        return (
          <path
            key={id}
            d={pathData}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="pointer-events-auto cursor-pointer"
            onMouseEnter={() => {
              if (matchedCountry) setHoveredCountryId(matchedCountry.id);
            }}
            onMouseLeave={() => {
              setHoveredCountryId(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!hasMovedRef.current && matchedCountry) {
                onSelectCountry(matchedCountry);
              }
            }}
          />
        );
      })}
    </>
  );
};
