import { geoEquirectangular, geoPath, geoGraticule10 } from 'd3-geo';
import { CountryMarket } from '../types';

export interface TransformState {
  x: number;
  y: number;
  k: number;
}

export async function fetchWorldGeoJson(): Promise<any[]> {
  const urls = [
    'https://unpkg.com/three-globe/example/country-polygons/ne_110m_admin_0_countries.geojson',
    'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.features) {
          return data.features;
        }
      }
    } catch {
      // ignore and try fallback
    }
  }
  return [];
}

export function buildCountryFeatureMap(
  countries: CountryMarket[],
  geoJsonFeatures: any[]
): Map<any, CountryMarket> {
  const map = new Map<any, CountryMarket>();
  const countryByCode = new Map<string, CountryMarket>();
  const countryByName = new Map<string, CountryMarket>();

  countries.forEach(c => {
    countryByCode.set(c.id.toUpperCase(), c);
    countryByCode.set(c.code.toUpperCase(), c);
    countryByName.set(c.name.toLowerCase(), c);
  });

  geoJsonFeatures.forEach(feature => {
    const p = feature.properties || {};
    const isoA2 = (p.ISO_A2 || p.iso_a2 || p.ISO2 || '').toUpperCase();
    const isoA3 = (p.ISO_A3 || p.iso_a3 || p.ISO3 || p.ADM0_A3 || '').toUpperCase();
    const name = (p.NAME || p.name || p.ADMIN || p.admin || p.SOVEREIGNT || '').toLowerCase();

    const match = countryByCode.get(isoA2) || countryByCode.get(isoA3) || countryByName.get(name);
    if (match) {
      map.set(feature, match);
    }
  });

  return map;
}

export function createProjection(width: number, height: number) {
  const baseScale = (height / Math.PI) * 0.98;
  const proj = geoEquirectangular()
    .scale(baseScale)
    .translate([width / 2, height / 2]);

  const pathGen = geoPath().projection(proj);
  const graticule = geoGraticule10();
  const gratPath = pathGen(graticule as any);

  return {
    projection: proj,
    pathGenerator: pathGen,
    graticulePath: gratPath
  };
}

export function clampTransformValues(
  t: TransformState,
  width: number,
  height: number
): TransformState {
  const k = Math.max(1.0, Math.min(20.0, t.k));
  
  const maxShiftY = ((k - 1) * height) / 2;
  const minY = -maxShiftY;
  const maxY = maxShiftY;

  const maxShiftX = Math.max(width * 0.5, ((k - 1) * width) / 2 + width * 0.45);
  const minX = -maxShiftX;
  const maxX = maxShiftX;

  const x = Math.max(minX, Math.min(maxX, t.x));
  const y = Math.max(minY, Math.min(maxY, t.y));

  return { x, y, k };
}
