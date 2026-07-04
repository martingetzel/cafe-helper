export type Method = 'v60' | 'frenchPress'
export type Roast = 'light' | 'medium' | 'dark'
export type Flavor = 'sweet' | 'standard' | 'bright'
export type Strength = 'light' | 'medium' | 'strong'

/** Which quantity the user is directly typing; the other is derived from ratio. */
export type SolveFor = 'coffee' | 'water'

/**
 * Tetsu Kasuya's 4:6 method; James Hoffmann's fixed 3-pour "Ultimate V60";
 * Scott Rao's minimal-pour method; or Lance Hedrick's agitation-forward
 * 4-pour "Easy and Effective" recipe.
 */
export type V60Recipe = 'kasuya46' | 'hoffmann' | 'scottRao' | 'lanceHedrick'
/**
 * SCA-style bloom/steep/plunge; James Hoffmann's long-steep method (plunger
 * rests on top, never pressed to the bottom); Scott Rao's short version of
 * the same idea; or Gwilym Davies' long, low-sediment method.
 */
export type FrenchPressRecipe = 'standard' | 'hoffmann' | 'scottRao' | 'gwilymDavies'

export interface RecipeInput {
  method: Method
  v60Recipe: V60Recipe
  frenchPressRecipe: FrenchPressRecipe
  solveFor: SolveFor
  /** Authoritative only when solveFor === 'coffee'; otherwise a derived display value. */
  coffeeGrams: number
  /** Authoritative only when solveFor === 'water'; otherwise a derived display value. */
  totalWaterGrams: number
  ratio: number
  roast: Roast
  /** Only meaningful for recipes that expose a pour-balance/temperature control (currently: Kasuya 4:6). */
  flavor: Flavor
  /** Only meaningful for recipes that expose a strength control (currently: Kasuya 4:6 and standard French press). */
  strength: Strength
  /** Free-text personal note, e.g. grinder click setting. Not used in calculations. */
  grinderNote?: string
}

export type StepKind = 'pour' | 'stir' | 'rest' | 'skim' | 'plunge'

export interface PourStep {
  id: string
  label: string
  /** Seconds from brew start when this step begins. */
  atSeconds: number
  /** Grams of water added at this step (0 for non-pour actions). */
  waterGrams: number
  /** Running total of water poured so far, including this step. */
  cumulativeWaterGrams: number
  kind: StepKind
  note?: string
}

export interface RecipeSource {
  /** Short attribution, e.g. "Tetsu Kasuya — 4:6 Method". */
  name: string
  /** Link to the page/video this recipe's numbers were sourced from. */
  url: string
}

export interface BrewPlan {
  method: Method
  input: RecipeInput
  totalWaterGrams: number
  waterTempC: number
  grindHint: string
  steps: PourStep[]
  totalTimeSeconds: number
  source: RecipeSource
}
