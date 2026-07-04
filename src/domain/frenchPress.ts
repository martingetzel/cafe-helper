import type { BrewPlan, RecipeInput, Strength, PourStep } from './types'
import { ROAST_TEMP_C, FLAVOR_TEMP_OFFSET_C } from './roast'

// ---------------------------------------------------------------------------
// Standard SCA-style French press
// ---------------------------------------------------------------------------
/**
 * Bloom pour, short rest, remaining water, steep, break the crust, plunge.
 * Strength is controlled by total steep time; flavor nudges water
 * temperature slightly warmer (bright) or cooler (sweet).
 */

const BLOOM_MULTIPLIER = 2.5 // grams of bloom water per gram of coffee
const BLOOM_WAIT_SECONDS = 45
const SKIM_BEFORE_PLUNGE_SECONDS = 20

const STEEP_SECONDS: Record<Strength, number> = {
  light: 210, // 3:30
  medium: 240, // 4:00
  strong: 270, // 4:30
}

export const FRENCH_PRESS_GRIND_HINT = 'Coarse, like coarse sea salt or breadcrumbs.'

export const STANDARD_FRENCH_PRESS_SOURCE = {
  name: 'SCA-style French press guidance (Mug Cult brewing guide)',
  url: 'https://mugcult.com/guides/french-press-brewing-guide',
}

function calculateStandardFrenchPress(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast, flavor, strength } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)
  const bloomGrams = Math.round(coffeeGrams * BLOOM_MULTIPLIER)
  const remainingGrams = totalWaterGrams - bloomGrams
  const steepEnd = STEEP_SECONDS[strength]

  const steps: PourStep[] = [
    {
      id: 'bloom',
      label: 'Bloom pour',
      atSeconds: 0,
      waterGrams: bloomGrams,
      cumulativeWaterGrams: bloomGrams,
      kind: 'pour',
      note: 'Saturate all grounds, give it a gentle stir',
    },
    {
      id: 'main-pour',
      label: 'Remaining water',
      atSeconds: BLOOM_WAIT_SECONDS,
      waterGrams: remainingGrams,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'pour',
      note: 'Fill to the top and place the lid on (plunger up)',
    },
    {
      id: 'skim',
      label: 'Break crust & skim',
      atSeconds: steepEnd - SKIM_BEFORE_PLUNGE_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'skim',
      note: 'Gently break the crust and skim off the foam/grounds',
    },
    {
      id: 'plunge',
      label: 'Plunge',
      atSeconds: steepEnd,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'plunge',
      note: 'Press slowly and evenly, then serve immediately',
    },
  ]

  return {
    method: 'frenchPress',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast] + FLAVOR_TEMP_OFFSET_C[flavor],
    grindHint: FRENCH_PRESS_GRIND_HINT,
    steps,
    totalTimeSeconds: steepEnd,
    source: STANDARD_FRENCH_PRESS_SOURCE,
  }
}

// ---------------------------------------------------------------------------
// James Hoffmann's French press method
// ---------------------------------------------------------------------------
/**
 * All the water goes in at once — no separate bloom. The brew steeps for a
 * full 4:15, then the crust is broken and skimmed, then it rests undisturbed
 * for another 5 minutes so the fines settle out. The key move, and the one
 * that makes this method distinct: the plunger is lowered until the screen
 * just touches the surface of the coffee — it is *not* pressed down to the
 * bottom of the beaker, so the settled grounds and fines are never disturbed
 * or forced through the filter.
 * Sourced from Hoffmann's published recipe (30g coffee : 500g water, ~10:00
 * total): pour at 0:00, sit at 0:15, break crust at 4:15, rest from 4:45,
 * plunge (not to the bottom) at 9:45.
 */

export const HOFFMANN_FRENCH_PRESS_GRIND_HINT =
  'Medium-coarse — a little finer than a standard French press grind, since the long steep needs less coarseness.'

export const HOFFMANN_FRENCH_PRESS_SOURCE = {
  name: 'James Hoffmann — French Press Recipe (timer.coffee)',
  url: 'https://www.timer.coffee/recipes/french-press/james-hoffmann-french-press-recipe/',
}

const HOFFMANN_FP_SETTLE_SECONDS = 15
const HOFFMANN_FP_BREAK_CRUST_SECONDS = 255 // 4:15
const HOFFMANN_FP_REST_MORE_SECONDS = 285 // 4:45 (rest continues until the plunge, 5:00 later)
const HOFFMANN_FP_PLUNGE_SECONDS = 585 // 9:45

function calculateHoffmannFrenchPress(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast, flavor } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)

  const steps: PourStep[] = [
    {
      id: 'hoffmann-fp-pour',
      label: 'Pour all water',
      atSeconds: 0,
      waterGrams: totalWaterGrams,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'pour',
      note: 'Add all the water in one go — no separate bloom for this method',
    },
    {
      id: 'hoffmann-fp-settle',
      label: 'Let it steep',
      atSeconds: HOFFMANN_FP_SETTLE_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Leave it undisturbed',
    },
    {
      id: 'hoffmann-fp-break-crust',
      label: 'Break crust & skim',
      atSeconds: HOFFMANN_FP_BREAK_CRUST_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'skim',
      note: 'Stir the crust with a spoon, then skim off the foam and floating grounds',
    },
    {
      id: 'hoffmann-fp-rest-more',
      label: 'Rest 5 more minutes',
      atSeconds: HOFFMANN_FP_REST_MORE_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Let the fines settle to the bottom, undisturbed',
    },
    {
      id: 'hoffmann-fp-plunge',
      label: 'Plunge — not to the bottom',
      atSeconds: HOFFMANN_FP_PLUNGE_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'plunge',
      note: "Lower the plunger just until it touches the surface. Don't press it to the bottom — that keeps the settled grounds and fines out of your cup.",
    },
  ]

  return {
    method: 'frenchPress',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast] + FLAVOR_TEMP_OFFSET_C[flavor],
    grindHint: HOFFMANN_FRENCH_PRESS_GRIND_HINT,
    steps,
    totalTimeSeconds: HOFFMANN_FP_PLUNGE_SECONDS,
    source: HOFFMANN_FRENCH_PRESS_SOURCE,
  }
}

// ---------------------------------------------------------------------------
// Scott Rao's French press
// ---------------------------------------------------------------------------
/**
 * A shorter cousin of the "don't plunge to the bottom" idea: pour once,
 * quickly rest the plunger screen just below the surface almost immediately
 * (rather than waiting until the end), then a normal 4-minute steep and a
 * gentle plunge.
 * Sourced from Rao's published recipe (30g coffee : 540g water, 5:20 total):
 * pour at 0:00, rest plunger 1cm below the surface at 0:10, wait until 4:20,
 * plunge gently, then rest until 5:20 for the grounds to settle before serving.
 */

export const SCOTT_RAO_FRENCH_PRESS_GRIND_HINT = 'Medium.'

export const SCOTT_RAO_FRENCH_PRESS_SOURCE = {
  name: 'Scott Rao — French Press Recipe (timer.coffee)',
  url: 'https://www.timer.coffee/recipes/french-press/scott-rao-french-press-recipe/',
}

const SCOTT_RAO_FP_REST_PLUNGER_SECONDS = 10
const SCOTT_RAO_FP_PLUNGE_SECONDS = 260 // 4:20
const SCOTT_RAO_FP_TOTAL_TIME_SECONDS = 320 // 5:20

function calculateScottRaoFrenchPress(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast, flavor } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)

  const steps: PourStep[] = [
    {
      id: 'scott-rao-fp-pour',
      label: 'Pour all water',
      atSeconds: 0,
      waterGrams: totalWaterGrams,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'pour',
      note: 'Pour quickly, all at once, making sure every ground is wet',
    },
    {
      id: 'scott-rao-fp-rest-plunger',
      label: 'Rest the plunger',
      atSeconds: SCOTT_RAO_FP_REST_PLUNGER_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Place the plunger about 1cm below the surface — do not press',
    },
    {
      id: 'scott-rao-fp-plunge',
      label: 'Plunge gently',
      atSeconds: SCOTT_RAO_FP_PLUNGE_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'plunge',
      note: 'Press down gently and evenly',
    },
    {
      id: 'scott-rao-fp-settle',
      label: 'Let it settle',
      atSeconds: SCOTT_RAO_FP_PLUNGE_SECONDS + 10,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Wait for coffee particles to settle, then serve',
    },
  ]

  return {
    method: 'frenchPress',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast] + FLAVOR_TEMP_OFFSET_C[flavor],
    grindHint: SCOTT_RAO_FRENCH_PRESS_GRIND_HINT,
    steps,
    totalTimeSeconds: SCOTT_RAO_FP_TOTAL_TIME_SECONDS,
    source: SCOTT_RAO_FRENCH_PRESS_SOURCE,
  }
}

// ---------------------------------------------------------------------------
// Gwilym Davies' French press
// ---------------------------------------------------------------------------
/**
 * A long, deliberate process aimed at the lowest possible sediment: pour,
 * rest 5 minutes with the lid off, stir, insert the plunger without pressing,
 * rest 3 more minutes, press slowly, rest 2 more minutes, then pour out and
 * wait 2 final minutes before serving.
 * Sourced from Davies' published recipe (16g coffee : 250g water, 12:45
 * total): pour at 0:00, rest from 0:10, stir at 5:10, insert plunger at
 * 5:20, rest from 5:25, press at 8:25, rest from 8:45, pour out at 10:45.
 */

export const GWILYM_DAVIES_FRENCH_PRESS_GRIND_HINT = 'Medium.'

export const GWILYM_DAVIES_FRENCH_PRESS_SOURCE = {
  name: 'Gwilym Davies — French Press Recipe (timer.coffee)',
  url: 'https://www.timer.coffee/recipes/french-press/gwilym-davies-french-press-recipe/',
}

const GWILYM_FP_REST_SECONDS = 10 // 0:10, wait 5 min
const GWILYM_FP_STIR_SECONDS = 310 // 5:10
const GWILYM_FP_INSERT_PLUNGER_SECONDS = 320 // 5:20
const GWILYM_FP_REST_2_SECONDS = 325 // 5:25, wait 3 min
const GWILYM_FP_PRESS_SECONDS = 505 // 8:25
const GWILYM_FP_REST_3_SECONDS = 525 // 8:45, wait 2 min
const GWILYM_FP_POUR_OUT_SECONDS = 645 // 10:45
const GWILYM_FP_TOTAL_TIME_SECONDS = 765 // 12:45

function calculateGwilymDaviesFrenchPress(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast, flavor } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)

  const steps: PourStep[] = [
    {
      id: 'gwilym-fp-pour',
      label: 'Pour all water',
      atSeconds: 0,
      waterGrams: totalWaterGrams,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'pour',
      note: 'Add it quickly',
    },
    {
      id: 'gwilym-fp-rest-1',
      label: 'Rest, lid off',
      atSeconds: GWILYM_FP_REST_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Leave the lid off and wait 5 minutes',
    },
    {
      id: 'gwilym-fp-stir',
      label: 'Stir',
      atSeconds: GWILYM_FP_STIR_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'stir',
      note: 'Mix the coffee and water with a tablespoon',
    },
    {
      id: 'gwilym-fp-insert-plunger',
      label: 'Insert plunger',
      atSeconds: GWILYM_FP_INSERT_PLUNGER_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: "Insert the plunger, but don't press it down yet",
    },
    {
      id: 'gwilym-fp-rest-2',
      label: 'Rest',
      atSeconds: GWILYM_FP_REST_2_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Wait 3 minutes',
    },
    {
      id: 'gwilym-fp-press',
      label: 'Press slowly',
      atSeconds: GWILYM_FP_PRESS_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'plunge',
      note: 'Press the plunger down slowly',
    },
    {
      id: 'gwilym-fp-rest-3',
      label: 'Rest',
      atSeconds: GWILYM_FP_REST_3_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Wait 2 minutes',
    },
    {
      id: 'gwilym-fp-pour-out',
      label: 'Pour into carafe',
      atSeconds: GWILYM_FP_POUR_OUT_SECONDS,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Pour the coffee out, then wait 2 more minutes before serving',
    },
  ]

  return {
    method: 'frenchPress',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast] + FLAVOR_TEMP_OFFSET_C[flavor],
    grindHint: GWILYM_DAVIES_FRENCH_PRESS_GRIND_HINT,
    steps,
    totalTimeSeconds: GWILYM_FP_TOTAL_TIME_SECONDS,
    source: GWILYM_DAVIES_FRENCH_PRESS_SOURCE,
  }
}

export function calculateFrenchPress(input: RecipeInput): BrewPlan {
  switch (input.frenchPressRecipe) {
    case 'hoffmann':
      return calculateHoffmannFrenchPress(input)
    case 'scottRao':
      return calculateScottRaoFrenchPress(input)
    case 'gwilymDavies':
      return calculateGwilymDaviesFrenchPress(input)
    default:
      return calculateStandardFrenchPress(input)
  }
}
