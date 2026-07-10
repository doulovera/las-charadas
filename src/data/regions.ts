import { getLocales } from 'expo-localization';

import type { RegionCode } from '../types';

export const REGIONS: Array<{
  code: RegionCode;
  name: string;
  flag: string;
  confirmation: string;
}> = [
  { code: 'PE', name: 'Perú', flag: '🇵🇪', confirmation: 'usar Perú' },
  { code: 'MX', name: 'México', flag: '🇲🇽', confirmation: 'usar México' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', confirmation: 'usar Argentina' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', confirmation: 'usar Colombia' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', confirmation: 'usar Chile' },
  { code: 'ES', name: 'España', flag: '🇪🇸', confirmation: 'usar España' },
  { code: 'GENERAL', name: 'Español general', flag: '🌎', confirmation: 'usar español general' },
];

const SUPPORTED = new Set<RegionCode>(REGIONS.map((region) => region.code));

export function detectDeviceRegion(): RegionCode {
  const regionCode = getLocales()[0]?.regionCode?.toUpperCase() as RegionCode | undefined;
  return regionCode && SUPPORTED.has(regionCode) ? regionCode : 'GENERAL';
}

export function getRegion(code: RegionCode) {
  return REGIONS.find((region) => region.code === code) ?? REGIONS[REGIONS.length - 1]!;
}
