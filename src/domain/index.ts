import type { BrewPlan, RecipeInput, V60Recipe, FrenchPressRecipe } from './types'
import { calculateV60 } from './v60'
import { calculateFrenchPress } from './frenchPress'

export * from './types'
export * from './roast'
export {
  calculateV60,
  V60_GRIND_HINT,
  HOFFMANN_V60_GRIND_HINT,
  SCOTT_RAO_V60_GRIND_HINT,
  LANCE_HEDRICK_V60_GRIND_HINT,
  KASUYA_46_SOURCE,
  HOFFMANN_V60_SOURCE,
  SCOTT_RAO_V60_SOURCE,
  LANCE_HEDRICK_V60_SOURCE,
} from './v60'
export {
  calculateFrenchPress,
  FRENCH_PRESS_GRIND_HINT,
  HOFFMANN_FRENCH_PRESS_GRIND_HINT,
  SCOTT_RAO_FRENCH_PRESS_GRIND_HINT,
  GWILYM_DAVIES_FRENCH_PRESS_GRIND_HINT,
  STANDARD_FRENCH_PRESS_SOURCE,
  HOFFMANN_FRENCH_PRESS_SOURCE,
  SCOTT_RAO_FRENCH_PRESS_SOURCE,
  GWILYM_DAVIES_FRENCH_PRESS_SOURCE,
} from './frenchPress'

/** Which named recipe is currently selected, regardless of method. */
export type RecipeVariant = V60Recipe | FrenchPressRecipe

export function getRecipeVariant(input: RecipeInput): RecipeVariant {
  return input.method === 'v60' ? input.v60Recipe : input.frenchPressRecipe
}

/** Only Kasuya's 4:6 (V60) and the standard French press expose flavor/strength controls — the other recipes are fixed schedules. */
export function recipeSupportsFlavorStrength(input: RecipeInput): boolean {
  const variant = getRecipeVariant(input)
  return variant === 'kasuya46' || variant === 'standard'
}

function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}

/**
 * Coffee weight (g) implied by the input, regardless of which field the user
 * is actually typing into. When solveFor is 'water', this divides the
 * requested total water by the ratio (rounded to 0.1g, since most kitchen
 * scales don't go finer than that).
 */
export function resolveCoffeeGrams(input: RecipeInput): number {
  if (input.solveFor === 'water') {
    return roundTo(input.totalWaterGrams / input.ratio, 1)
  }
  return input.coffeeGrams
}

export function calculateBrewPlan(input: RecipeInput): BrewPlan {
  // Coffee weight is the one number every downstream calculation is built
  // from, so resolve it here once and hand each method a fully-normalized
  // input — v60.ts / frenchPress.ts stay agnostic of solveFor entirely.
  const normalized: RecipeInput = { ...input, coffeeGrams: resolveCoffeeGrams(input) }
  return normalized.method === 'v60' ? calculateV60(normalized) : calculateFrenchPress(normalized)
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
