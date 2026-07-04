import type { Roast, Flavor } from './types'

/** Baseline water temperature (°C) by roast level. */
export const ROAST_TEMP_C: Record<Roast, number> = {
  light: 93,
  medium: 88,
  dark: 83,
}

/** Small nudge applied on top of roast baseline for methods where flavor affects temp (French press). */
export const FLAVOR_TEMP_OFFSET_C: Record<Flavor, number> = {
  sweet: -2,
  standard: 0,
  bright: 2,
}
