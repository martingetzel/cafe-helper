/**
 * Split `total` grams across the given fractions, rounding each to the nearest
 * gram while guaranteeing the parts sum exactly to `total` (any rounding
 * remainder is absorbed into the last part).
 */
export function distributeWater(total: number, fractions: number[]): number[] {
  const raw = fractions.map((f) => total * f)
  const rounded = raw.map((n) => Math.round(n))
  const sum = rounded.reduce((a, b) => a + b, 0)
  const diff = Math.round(total) - sum
  if (rounded.length > 0) {
    rounded[rounded.length - 1] += diff
  }
  return rounded
}

/**
 * Some recipes are documented as a series of "pour until the scale reads Xg"
 * checkpoints rather than discrete pour amounts (e.g. Lance Hedrick's V60).
 * Given cumulative fractions of `total` (must end at 1), this returns both
 * the rounded running totals and the per-step amount poured to reach each one.
 * The final checkpoint is forced to equal `total` exactly.
 */
export function distributeCumulativeWater(
  total: number,
  cumulativeFractions: number[],
): { cumulative: number[]; amounts: number[] } {
  const cumulative = cumulativeFractions.map((f) => Math.round(total * f))
  if (cumulative.length > 0) {
    cumulative[cumulative.length - 1] = Math.round(total)
  }
  const amounts = cumulative.map((c, i) => (i === 0 ? c : c - cumulative[i - 1]))
  return { cumulative, amounts }
}
