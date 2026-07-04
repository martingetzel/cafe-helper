import type { BrewPlan, Flavor, RecipeInput, Strength, PourStep } from './types'
import { ROAST_TEMP_C } from './roast'
import { distributeWater, distributeCumulativeWater } from './distribute'

// ---------------------------------------------------------------------------
// Tetsu Kasuya's 4:6 method
// ---------------------------------------------------------------------------
/**
 * Water is split 40% "front" (controls sweetness/acidity balance) and 60%
 * "back" (controls strength). This mirrors the flavor x strength grid from
 * Kasuya's own reference chart: front pours are always at 0:00 and 0:45; back
 * pours start at 1:30 and are spaced 45s apart (the final gap shortens to 30s
 * when there are 3 back pours, matching the original chart's ~3:30 finish).
 */

// Fraction of the front 40% given to [pour1, pour2].
const FRONT_SPLIT: Record<Flavor, [number, number]> = {
  sweet: [50 / 160, 110 / 160], // smaller first pour -> sweeter
  standard: [75 / 160, 85 / 160],
  bright: [100 / 160, 60 / 160], // larger first pour -> brighter/more acidic
}

// Absolute start times (seconds) for the back pours, by strength.
const BACK_TIMES: Record<Strength, number[]> = {
  light: [90],
  medium: [90, 135],
  strong: [90, 135, 165],
}

// Even split of the back 60% across however many back pours that strength uses.
const BACK_SPLIT: Record<Strength, number[]> = {
  light: [1],
  medium: [0.5, 0.5],
  strong: [1 / 3, 1 / 3, 1 / 3],
}

export const V60_GRIND_HINT = 'Medium-coarse, like coarse sand (adjust finer for a slower drawdown).'

export const KASUYA_46_SOURCE = {
  name: 'Tetsu Kasuya — 4:6 Method (Pull & Pour Coffee)',
  url: 'https://pullandpourcoffee.com/v60-4-to-6-method-pour-over/',
}

function calculateKasuya46(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast, flavor, strength } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)
  const front = totalWaterGrams * 0.4
  const back = totalWaterGrams * 0.6

  const frontPours = distributeWater(front, FRONT_SPLIT[flavor])
  const backPours = distributeWater(back, BACK_SPLIT[strength])
  const backTimes = BACK_TIMES[strength]

  const steps: PourStep[] = []
  let cumulative = 0

  const frontTimes = [0, 45]
  frontPours.forEach((grams, i) => {
    cumulative += grams
    steps.push({
      id: `front-${i}`,
      label: `Pour ${i + 1}`,
      atSeconds: frontTimes[i],
      waterGrams: grams,
      cumulativeWaterGrams: cumulative,
      kind: 'pour',
      note: i === 0 ? 'Bloom + first pour, slow concentric circles' : undefined,
    })
  })

  backPours.forEach((grams, i) => {
    cumulative += grams
    steps.push({
      id: `back-${i}`,
      label: `Pour ${frontPours.length + i + 1}`,
      atSeconds: backTimes[i],
      waterGrams: grams,
      cumulativeWaterGrams: cumulative,
      kind: 'pour',
    })
  })

  const lastPourTime = steps[steps.length - 1].atSeconds
  const totalTimeSeconds = lastPourTime + 45 // approximate drawdown to finish

  return {
    method: 'v60',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast],
    grindHint: V60_GRIND_HINT,
    steps,
    totalTimeSeconds,
    source: KASUYA_46_SOURCE,
  }
}

// ---------------------------------------------------------------------------
// James Hoffmann's "Ultimate V60" technique
// ---------------------------------------------------------------------------
/**
 * A fixed, three-pour schedule (no flavor/strength knobs): bloom at 12% of
 * total water, swirl to saturate, then two more pours taking the total to 60%
 * and then 100%, followed by a gentle stir + swirl to flatten the bed.
 * Sourced from Hoffmann's published recipe (30g coffee : 500g water, 3:30
 * total): bloom 60g, pour to 300g by 0:45, pour to 500g by 1:15, stir at
 * 1:45, swirl at 1:55, drawdown finishing ~3:30.
 */

export const HOFFMANN_V60_GRIND_HINT = 'Medium-fine — a bit finer than most V60 recipes call for.'

export const HOFFMANN_V60_SOURCE = {
  name: 'James Hoffmann — Ultimate V60 Recipe (timer.coffee)',
  url: 'https://www.timer.coffee/recipes/v60/james-hoffman-v60-recipe/',
}

const HOFFMANN_BLOOM_FRACTION = 0.12
const HOFFMANN_SECOND_POUR_CUMULATIVE_FRACTION = 0.6
const HOFFMANN_TOTAL_TIME_SECONDS = 210 // 3:30

function calculateHoffmannV60(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)

  const bloomGrams = Math.round(totalWaterGrams * HOFFMANN_BLOOM_FRACTION)
  const secondPourTarget = Math.round(totalWaterGrams * HOFFMANN_SECOND_POUR_CUMULATIVE_FRACTION)
  const secondPourGrams = secondPourTarget - bloomGrams
  const thirdPourGrams = totalWaterGrams - secondPourTarget

  const steps: PourStep[] = [
    {
      id: 'hoffmann-bloom',
      label: 'Bloom pour',
      atSeconds: 0,
      waterGrams: bloomGrams,
      cumulativeWaterGrams: bloomGrams,
      kind: 'pour',
      note: 'Spiral pour from the centre outwards to wet all the grounds',
    },
    {
      id: 'hoffmann-swirl-1',
      label: 'Swirl',
      atSeconds: 10,
      waterGrams: 0,
      cumulativeWaterGrams: bloomGrams,
      kind: 'stir',
      note: 'Swirl the brewer until the slurry looks even, then let it bloom',
    },
    {
      id: 'hoffmann-pour-2',
      label: 'Main pour 1',
      atSeconds: 45,
      waterGrams: secondPourGrams,
      cumulativeWaterGrams: secondPourTarget,
      kind: 'pour',
      note: `Pour from the centre outwards over ~30s, up to ${secondPourTarget}g total`,
    },
    {
      id: 'hoffmann-pour-3',
      label: 'Main pour 2',
      atSeconds: 75,
      waterGrams: thirdPourGrams,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'pour',
      note: `Centre pour over ~30s, keeping the V60 full, up to ${totalWaterGrams}g total`,
    },
    {
      id: 'hoffmann-stir',
      label: 'Stir',
      atSeconds: 105,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'stir',
      note: 'One gentle stir clockwise, one counter-clockwise — no whirlpool',
    },
    {
      id: 'hoffmann-swirl-2',
      label: 'Flatten swirl',
      atSeconds: 115,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'stir',
      note: 'Gently swirl 2-3 times to flatten the bed for an even drawdown',
    },
    {
      id: 'hoffmann-drawdown',
      label: 'Drawdown',
      atSeconds: 125,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Wait for the water to fully drain through',
    },
  ]

  return {
    method: 'v60',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast],
    grindHint: HOFFMANN_V60_GRIND_HINT,
    steps,
    totalTimeSeconds: HOFFMANN_TOTAL_TIME_SECONDS,
    source: HOFFMANN_V60_SOURCE,
  }
}

// ---------------------------------------------------------------------------
// Scott Rao's minimal-pour V60
// ---------------------------------------------------------------------------
/**
 * A deliberately simple, low-agitation-count method: one bloom (3x coffee
 * weight), one main pour to fill, then a stir and a flattening swirl. Rao
 * avoids splitting the main pour further, arguing more pours lower the
 * average brew temperature and can hurt consistency.
 * Sourced from Rao's published recipe (22g coffee : 360g water, 3:00 total):
 * pre-wet 66g at 0:00, excavate at 0:15, main pour to 360g at 0:45, stir at
 * 1:35, swirl at 2:00, drawdown finishing by 3:00.
 */

export const SCOTT_RAO_V60_GRIND_HINT = 'Medium-fine.'

export const SCOTT_RAO_V60_SOURCE = {
  name: 'Scott Rao — Classic V60 Recipe (timer.coffee)',
  url: 'https://www.timer.coffee/recipes/v60/scott-rao-classic-v60-recipe/',
}

const SCOTT_RAO_BLOOM_MULTIPLIER = 3 // grams of bloom water per gram of coffee
const SCOTT_RAO_TOTAL_TIME_SECONDS = 180 // 3:00

function calculateScottRaoV60(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)
  const bloomGrams = Math.round(coffeeGrams * SCOTT_RAO_BLOOM_MULTIPLIER)
  const mainPourGrams = totalWaterGrams - bloomGrams

  const steps: PourStep[] = [
    {
      id: 'scott-rao-bloom',
      label: 'Pre-wet',
      atSeconds: 0,
      waterGrams: bloomGrams,
      cumulativeWaterGrams: bloomGrams,
      kind: 'pour',
      note: 'Saturate all the grounds evenly',
    },
    {
      id: 'scott-rao-excavate',
      label: 'Excavate',
      atSeconds: 15,
      waterGrams: 0,
      cumulativeWaterGrams: bloomGrams,
      kind: 'stir',
      note: 'Gently dig in to wet any dry pockets of coffee',
    },
    {
      id: 'scott-rao-main-pour',
      label: 'Main pour',
      atSeconds: 45,
      waterGrams: mainPourGrams,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'pour',
      note: `One continuous pour up to ${totalWaterGrams}g total`,
    },
    {
      id: 'scott-rao-stir',
      label: 'Stir',
      atSeconds: 95,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'stir',
      note: 'Gently stir to knock grounds off the sides',
    },
    {
      id: 'scott-rao-swirl',
      label: 'Rao spin',
      atSeconds: 120,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'stir',
      note: 'Swirl to flatten the bed for an even brew',
    },
    {
      id: 'scott-rao-drawdown',
      label: 'Drawdown',
      atSeconds: 130,
      waterGrams: 0,
      cumulativeWaterGrams: totalWaterGrams,
      kind: 'rest',
      note: 'Drawdown should finish within about 3 minutes total',
    },
  ]

  return {
    method: 'v60',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast],
    grindHint: SCOTT_RAO_V60_GRIND_HINT,
    steps,
    totalTimeSeconds: SCOTT_RAO_TOTAL_TIME_SECONDS,
    source: SCOTT_RAO_V60_SOURCE,
  }
}

// ---------------------------------------------------------------------------
// Lance Hedrick's "Easy and Effective" V60
// ---------------------------------------------------------------------------
/**
 * An agitation-forward recipe: four pour checkpoints, each followed by a
 * spin, with the spins getting progressively lighter as the coffee bed
 * settles. Hedrick doesn't shy away from agitation — he uses it deliberately
 * to control extraction rather than avoiding it.
 * Sourced from Hedrick's published recipe (20g coffee : 340g water, 3:30
 * total): pour to 50g at 0:00, to 100g at 0:30, to 220g at 1:00, to 340g at
 * 1:30, each followed by a spin, then wait for full drawdown.
 */

export const LANCE_HEDRICK_V60_GRIND_HINT = 'Medium-fine.'

export const LANCE_HEDRICK_V60_SOURCE = {
  name: 'Lance Hedrick — Easy and Effective V60 (timer.coffee)',
  url: 'https://www.timer.coffee/recipes/v60/easy-and-effective-v60-by-lance-hedrick/',
}

// Cumulative fraction of total water at each pour checkpoint (0:00, 0:30, 1:00, 1:30).
const LANCE_HEDRICK_CUMULATIVE_FRACTIONS = [50 / 340, 100 / 340, 220 / 340, 1]
const LANCE_HEDRICK_POUR_TIMES = [0, 30, 60, 90]
const LANCE_HEDRICK_SPIN_TIMES = [10, 40, 70, 100]
const LANCE_HEDRICK_SPIN_NOTES = [
  'Spin somewhat aggressively',
  'Spin gently',
  'Spin very lightly',
  'Give it another light spin',
]
const LANCE_HEDRICK_TOTAL_TIME_SECONDS = 210 // 3:30

function calculateLanceHedrickV60(input: RecipeInput): BrewPlan {
  const { coffeeGrams, ratio, roast } = input
  const totalWaterGrams = Math.round(coffeeGrams * ratio)
  const { amounts } = distributeCumulativeWater(totalWaterGrams, LANCE_HEDRICK_CUMULATIVE_FRACTIONS)

  const steps: PourStep[] = []
  let cumulative = 0
  amounts.forEach((grams, i) => {
    cumulative += grams
    steps.push({
      id: `lance-hedrick-pour-${i}`,
      label: `Pour ${i + 1}`,
      atSeconds: LANCE_HEDRICK_POUR_TIMES[i],
      waterGrams: grams,
      cumulativeWaterGrams: cumulative,
      kind: 'pour',
      note: i >= 2 ? 'Fast flow rate, aimed just behind the centre' : undefined,
    })
    steps.push({
      id: `lance-hedrick-spin-${i}`,
      label: 'Spin',
      atSeconds: LANCE_HEDRICK_SPIN_TIMES[i],
      waterGrams: 0,
      cumulativeWaterGrams: cumulative,
      kind: 'stir',
      note: LANCE_HEDRICK_SPIN_NOTES[i],
    })
  })
  steps.push({
    id: 'lance-hedrick-drawdown',
    label: 'Drawdown',
    atSeconds: 110,
    waterGrams: 0,
    cumulativeWaterGrams: totalWaterGrams,
    kind: 'rest',
    note: 'Wait for the complete drawdown',
  })

  return {
    method: 'v60',
    input,
    totalWaterGrams,
    waterTempC: ROAST_TEMP_C[roast],
    grindHint: LANCE_HEDRICK_V60_GRIND_HINT,
    steps,
    totalTimeSeconds: LANCE_HEDRICK_TOTAL_TIME_SECONDS,
    source: LANCE_HEDRICK_V60_SOURCE,
  }
}

export function calculateV60(input: RecipeInput): BrewPlan {
  switch (input.v60Recipe) {
    case 'hoffmann':
      return calculateHoffmannV60(input)
    case 'scottRao':
      return calculateScottRaoV60(input)
    case 'lanceHedrick':
      return calculateLanceHedrickV60(input)
    default:
      return calculateKasuya46(input)
  }
}
