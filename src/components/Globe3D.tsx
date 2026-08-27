import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { CountryMarket } from '../types';
import { GlobePinsOverlay } from './GlobePinsOverlay';
import { GlobeMapControls } from './GlobeMapControls';
import { GlobePolygonsLayer } from './GlobePolygonsLayer';
import {
  TransformState,
  fetchWorldGeoJson,
  buildCountryFeatureMap,
  createProjection,
  clampTransformValues
} from '../utils/globeGeoUtils';

interface Globe3DProps {
  countries: CountryMarket[];
  selectedCountry: CountryMarket | null;
  onSelectCountry: (country: CountryMarket) => void;
  theme?: 'dark' | 'light';
  claimedCount?: number;
  mapFilter?: 'all' | 'claimed' | 'unclaimed';
}

export const Globe3D: React.FC<Globe3DProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  theme = 'dark',
  claimedCount,
  mapFilter = 'all'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgGroupRef = useRef<SVGGElement>(null);
  const pillRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 1000, height: 260 });
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<any[]>([]);
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [zoomLevelState, setZoomLevelState] = useState<number>(1);

  // Dedicated Hardware-Accelerated Transforms
  const transformRef = useRef<TransformState>({ x: 0, y: 0, k: 1 });
  const targetTransformRef = useRef<TransformState>({ x: 0, y: 0, k: 1 });
  const animFrameId = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const lastLoggedZoomRef = useRef<number>(1);

  // Pointer & Gesture tracking
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{
    dist: number;
    center: { x: number; y: number };
    initialK: number;
    initialTx: number;
    initialTy: number;
  } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; tx: number; ty: number }>({ x: 0, y: 0, tx: 0, ty: 0 });
  const velocityRef = useRef<{ vx: number; vy: number; lastX: number; lastY: number; lastTime: number }>({
    vx: 0,
    vy: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0
  });
  const hasMovedRef = useRef<boolean>(false);
  const rAFPointerId = useRef<number | null>(null);

  const isDark = theme === 'dark';
  const totalClaimed = claimedCount !== undefined ? claimedCount : countries.filter(c => c.currentWinnerProductId !== null).length;

  // Track container dimensions with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth || 1000;
        const h = containerRef.current.clientHeight || 260;
        setDimensions({ width: w, height: h });
      }
    };
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Fetch standard World GeoJSON country boundaries
  useEffect(() => {
    let isMounted = true;
    fetchWorldGeoJson().then(features => {
      if (isMounted && features?.length) {
        setGeoJsonFeatures(features);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Equirectangular projection calibrated to fit top and bottom of box cleanly
  const { projection, pathGenerator, graticulePath } = useMemo(() => {
    return createProjection(dimensions.width, dimensions.height);
  }, [dimensions]);

  // Fast mapping of GeoJSON feature properties to country ID
  const countryByFeature = useMemo(() => {
    return buildCountryFeatureMap(countries, geoJsonFeatures);
  }, [countries, geoJsonFeatures]);

  // Precompute SVG Country Polygon Path strings
  const renderedPolygons = useMemo(() => {
    return geoJsonFeatures.map((feature, i) => {
      const pathData = pathGenerator(feature);
      const matchedCountry = countryByFeature.get(feature);
      return {
        id: feature.id || i,
        pathData,
        matchedCountry
      };
    }).filter(p => p.pathData !== null);
  }, [geoJsonFeatures, pathGenerator, countryByFeature]);

  // Precompute base projected coordinates for all countries
  const projectedCountries = useMemo(() => {
    return countries.map(c => {
      const coords = projection([c.lng, c.lat]);
      return {
        country: c,
        baseX: coords ? coords[0] : -9999,
        baseY: coords ? coords[1] : -9999
      };
    });
  }, [countries, projection]);

  // Clamping for smooth bounded panning
  const clampTransform = useCallback((t: TransformState): TransformState => {
    return clampTransformValues(t, dimensions.width, dimensions.height);
  }, [dimensions]);

  // Exact Mathematical Coordinate Locking
  const applyTransform = useCallback((t: TransformState) => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    if (svgGroupRef.current) {
      svgGroupRef.current.style.transform = `translate3d(${cx + t.x}px, ${cy + t.y}px, 0px) scale(${t.k}) translate3d(${-cx}px, ${-cy}px, 0px)`;
    }

    const w = dimensions.width;
    const h = dimensions.height;
    const count = projectedCountries.length;

    for (let i = 0; i < count; i++) {
      const item = projectedCountries[i];
      if (item.baseX === -9999) continue;
      const el = pillRefs.current[item.country.id];
      if (!el) continue;

      const screenX = cx + t.x + (item.baseX - cx) * t.k;
      const screenY = cy + t.y + (item.baseY - cy) * t.k;

      if (screenX < -200 || screenX > w + 200 || screenY < -120 || screenY > h + 120) {
        if (el.style.visibility !== 'hidden') {
          el.style.visibility = 'hidden';
        }
      } else {
        if (el.style.visibility === 'hidden') {
          el.style.visibility = 'visible';
        }
        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0px) translate(-50%, -100%)`;
      }
    }

    const roundedK = Math.round(t.k * 10) / 10;
    if (Math.abs(roundedK - lastLoggedZoomRef.current) >= 0.2) {
      lastLoggedZoomRef.current = roundedK;
      setZoomLevelState(roundedK);
    }
  }, [dimensions, projectedCountries]);

  // Momentum & Lerp Animation Loop
  const startAnimationLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const animate = () => {
      const curr = transformRef.current;
      const target = targetTransformRef.current;

      const dx = target.x - curr.x;
      const dy = target.y - curr.y;
      const dk = target.k - curr.k;

      if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02 || Math.abs(dk) > 0.0002) {
        curr.x += dx * 0.4;
        curr.y += dy * 0.4;
        curr.k += dk * 0.4;
        applyTransform(curr);
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        curr.x = target.x;
        curr.y = target.y;
        curr.k = target.k;
        applyTransform(curr);
        setZoomLevelState(target.k);
        isAnimatingRef.current = false;
        animFrameId.current = null;
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
  }, [applyTransform]);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      applyTransform(transformRef.current);
    });
    return () => cancelAnimationFrame(timer);
  }, [mapFilter, applyTransform]);

  // Pointer Event Handlers (Supporting 1-finger pan & 2-finger pinch-to-zoom)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('#map-controls-group')) return;

    const container = containerRef.current;
    if (container) {
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // fallback
      }
    }

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pointerCount = activePointersRef.current.size;

    if (pointerCount === 1) {
      hasMovedRef.current = false;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transformRef.current.x,
        ty: transformRef.current.y
      };

      velocityRef.current = {
        vx: 0,
        vy: 0,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: performance.now()
      };
      pinchStartRef.current = null;
    } else if (pointerCount >= 2) {
      hasMovedRef.current = true;
      const pts: Array<{ x: number; y: number }> = [];
      activePointersRef.current.forEach(pt => pts.push(pt));
      const p1 = pts[0];
      const p2 = pts[1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const centerX = (p1.x + p2.x) / 2;
      const centerY = (p1.y + p2.y) / 2;

      pinchStartRef.current = {
        dist: Math.max(10, dist),
        center: { x: centerX, y: centerY },
        initialK: transformRef.current.k,
        initialTx: transformRef.current.x,
        initialTy: transformRef.current.y
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(e.pointerId)) return;
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const pointerCount = activePointersRef.current.size;

    if (pointerCount >= 2) {
      // Multi-Touch Two-Finger Pinch to Zoom & Pan
      hasMovedRef.current = true;
      const pts: Array<{ x: number; y: number }> = [];
      activePointersRef.current.forEach(pt => pts.push(pt));
      const p1 = pts[0];
      const p2 = pts[1];
      const currentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const currentCenterX = (p1.x + p2.x) / 2;
      const currentCenterY = (p1.y + p2.y) / 2;

      if (!pinchStartRef.current) {
        pinchStartRef.current = {
          dist: Math.max(10, currentDist),
          center: { x: currentCenterX, y: currentCenterY },
          initialK: transformRef.current.k,
          initialTx: transformRef.current.x,
          initialTy: transformRef.current.y
        };
      }

      const start = pinchStartRef.current;
      const scaleMultiplier = currentDist / start.dist;
      const newK = Math.max(1.0, Math.min(20.0, start.initialK * scaleMultiplier));

      const rect = containerRef.current?.getBoundingClientRect();
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;

      const focalLocalX = (start.center.x - (rect ? rect.left : 0)) - cx;
      const focalLocalY = (start.center.y - (rect ? rect.top : 0)) - cy;

      const scaleRatio = newK / start.initialK;
      const newTx = focalLocalX - (focalLocalX - start.initialTx) * scaleRatio + (currentCenterX - start.center.x);
      const newTy = focalLocalY - (focalLocalY - start.initialTy) * scaleRatio + (currentCenterY - start.center.y);

      if (rAFPointerId.current !== null) {
        cancelAnimationFrame(rAFPointerId.current);
      }

      rAFPointerId.current = requestAnimationFrame(() => {
        const clamped = clampTransform({
          x: newTx,
          y: newTy,
          k: newK
        });

        transformRef.current = clamped;
        targetTransformRef.current = clamped;
        applyTransform(transformRef.current);
        rAFPointerId.current = null;
      });
    } else if (pointerCount === 1) {
      // Single Pointer Pan
      const now = performance.now();
      const dt = Math.max(1, now - velocityRef.current.lastTime);
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      if (Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true;
      }

      velocityRef.current.vx = (e.clientX - velocityRef.current.lastX) / dt;
      velocityRef.current.vy = (e.clientY - velocityRef.current.lastY) / dt;
      velocityRef.current.lastX = e.clientX;
      velocityRef.current.lastY = e.clientY;
      velocityRef.current.lastTime = now;

      if (rAFPointerId.current !== null) {
        cancelAnimationFrame(rAFPointerId.current);
      }

      rAFPointerId.current = requestAnimationFrame(() => {
        const clamped = clampTransform({
          x: dragStartRef.current.tx + dx,
          y: dragStartRef.current.ty + dy,
          k: transformRef.current.k
        });

        transformRef.current = clamped;
        targetTransformRef.current = clamped;
        applyTransform(transformRef.current);
        rAFPointerId.current = null;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (container && container.hasPointerCapture(e.pointerId)) {
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // fallback
      }
    }

    activePointersRef.current.delete(e.pointerId);
    const pointerCount = activePointersRef.current.size;

    if (pointerCount === 1) {
      // Seamlessly switch back to 1-finger drag from the remaining touch point
      let remaining: { x: number; y: number } | undefined;
      activePointersRef.current.forEach(pt => { remaining = pt; });
      if (remaining) {
        dragStartRef.current = {
          x: (remaining as { x: number; y: number }).x,
          y: (remaining as { x: number; y: number }).y,
          tx: transformRef.current.x,
          ty: transformRef.current.y
        };
        velocityRef.current = {
          vx: 0,
          vy: 0,
          lastX: (remaining as { x: number; y: number }).x,
          lastY: (remaining as { x: number; y: number }).y,
          lastTime: performance.now()
        };
      }
      pinchStartRef.current = null;
    } else if (pointerCount === 0) {
      pinchStartRef.current = null;
      if (hasMovedRef.current) {
        const vx = Math.max(-4.0, Math.min(4.0, velocityRef.current.vx));
        const vy = Math.max(-4.0, Math.min(4.0, velocityRef.current.vy));
        if (Math.hypot(vx, vy) > 0.08) {
          targetTransformRef.current = clampTransform({
            x: targetTransformRef.current.x + vx * 180,
            y: targetTransformRef.current.y + vy * 180,
            k: targetTransformRef.current.k
          });
          startAnimationLoop();
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let zoomFactor = 1;
    if (e.ctrlKey) {
      // Trackpad pinch-to-zoom gesture
      zoomFactor = Math.exp(-e.deltaY * 0.015);
    } else {
      // Standard mouse scroll wheel
      zoomFactor = e.deltaY < 0 ? 1.18 : 0.847;
    }

    const currK = transformRef.current.k;
    const newK = Math.max(1.0, Math.min(20.0, currK * zoomFactor));

    if (Math.abs(newK - currK) < 0.0001) return;

    const currX = transformRef.current.x;
    const currY = transformRef.current.y;

    const relX = mouseX - cx;
    const relY = mouseY - cy;

    const scaleRatio = newK / currK;
    const newX = relX - (relX - currX) * scaleRatio;
    const newY = relY - (relY - currY) * scaleRatio;

    const clamped = clampTransform({ x: newX, y: newY, k: newK });
    transformRef.current = clamped;
    targetTransformRef.current = clamped;
    applyTransform(clamped);
  };

  const handleZoomIn = () => {
    const curr = transformRef.current;
    const newK = Math.min(20.0, curr.k * 1.35);
    const scaleRatio = newK / curr.k;
    const newX = curr.x * scaleRatio;
    const newY = curr.y * scaleRatio;

    targetTransformRef.current = clampTransform({ x: newX, y: newY, k: newK });
    startAnimationLoop();
  };

  const handleZoomOut = () => {
    const curr = transformRef.current;
    const newK = Math.max(1.0, curr.k / 1.35);
    const scaleRatio = newK / curr.k;
    const newX = curr.x * scaleRatio;
    const newY = curr.y * scaleRatio;

    targetTransformRef.current = clampTransform({ x: newX, y: newY, k: newK });
    startAnimationLoop();
  };

  const handleResetView = () => {
    targetTransformRef.current = { x: 0, y: 0, k: 1 };
    startAnimationLoop();
  };

  return (
    <div className="w-full flex flex-col">
      <div
        id="globe-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        style={{
          contain: 'layout paint size',
          transform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
        className={`relative w-full h-[220px] sm:h-[245px] md:h-[265px] select-none transition-colors duration-200 overflow-hidden flex items-center justify-center rounded-xl border touch-none cursor-grab active:cursor-grabbing ${
          isDark
            ? 'bg-[#06080e] border-[#1e2638] text-slate-100'
            : 'bg-[#f8fafc] border-[#cbd5e1] text-slate-900'
        }`}
      >
        {/* World Map SVG */}
        <svg
          className="w-full h-full absolute inset-0 pointer-events-none"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          shapeRendering="optimizeSpeed"
          textRendering="optimizeSpeed"
        >
          <g
            ref={svgGroupRef}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <GlobePolygonsLayer
              renderedPolygons={renderedPolygons as any}
              graticulePath={graticulePath}
              hoveredCountryId={hoveredCountryId}
              selectedCountry={selectedCountry}
              setHoveredCountryId={setHoveredCountryId}
              onSelectCountry={onSelectCountry}
              hasMovedRef={hasMovedRef}
              isDark={isDark}
            />
          </g>
        </svg>

        {/* Dynamic Country Territory Pins */}
        <GlobePinsOverlay
          projectedCountries={projectedCountries}
          pillRefs={pillRefs}
          selectedCountry={selectedCountry}
          hoveredCountryId={hoveredCountryId}
          setHoveredCountryId={setHoveredCountryId}
          onSelectCountry={onSelectCountry}
          hasMovedRef={hasMovedRef}
          zoomLevelState={zoomLevelState}
          isDark={isDark}
          mapFilter={mapFilter}
        />

        {/* Floating Controls & Stat Badges */}
        <GlobeMapControls
          totalClaimed={totalClaimed}
          totalCountries={countries.length}
          zoomLevelState={zoomLevelState}
          onResetView={handleResetView}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default Globe3D;
