import type { Method, PourStep } from '../domain/types'
import type { RecipeVariant } from '../domain'
import type { Translations } from './translations'

/**
 * The domain layer (src/domain/*) only knows step ids/kinds — it stays
 * language-agnostic. This maps a step to its translated label/note based on
 * the method, the selected recipe variant, and (for the pour-numbered
 * recipes) its position among the pours.
 */
export function translateStep(
  step: PourStep,
  method: Method,
  variant: RecipeVariant,
  pourIndex: number,
  t: Translations,
): { label: string; note?: string } {
  if (method === 'v60') {
    switch (variant) {
      case 'hoffmann':
        switch (step.id) {
          case 'hoffmann-bloom':
            return { label: t.steps.hoffmannV60.bloom, note: t.steps.hoffmannV60.bloomNote }
          case 'hoffmann-swirl-1':
            return { label: t.steps.hoffmannV60.swirl1, note: t.steps.hoffmannV60.swirl1Note }
          case 'hoffmann-pour-2':
            return { label: t.steps.hoffmannV60.pour2, note: t.steps.hoffmannV60.pour2Note(step.cumulativeWaterGrams) }
          case 'hoffmann-pour-3':
            return { label: t.steps.hoffmannV60.pour3, note: t.steps.hoffmannV60.pour3Note(step.cumulativeWaterGrams) }
          case 'hoffmann-stir':
            return { label: t.steps.hoffmannV60.stir, note: t.steps.hoffmannV60.stirNote }
          case 'hoffmann-swirl-2':
            return { label: t.steps.hoffmannV60.swirl2, note: t.steps.hoffmannV60.swirl2Note }
          case 'hoffmann-drawdown':
            return { label: t.steps.hoffmannV60.drawdown, note: t.steps.hoffmannV60.drawdownNote }
          default:
            return { label: step.label, note: step.note }
        }
      case 'scottRao':
        switch (step.id) {
          case 'scott-rao-bloom':
            return { label: t.steps.scottRaoV60.preWet, note: t.steps.scottRaoV60.preWetNote }
          case 'scott-rao-excavate':
            return { label: t.steps.scottRaoV60.excavate, note: t.steps.scottRaoV60.excavateNote }
          case 'scott-rao-main-pour':
            return { label: t.steps.scottRaoV60.mainPour, note: t.steps.scottRaoV60.mainPourNote(step.cumulativeWaterGrams) }
          case 'scott-rao-stir':
            return { label: t.steps.scottRaoV60.stir, note: t.steps.scottRaoV60.stirNote }
          case 'scott-rao-swirl':
            return { label: t.steps.scottRaoV60.swirl, note: t.steps.scottRaoV60.swirlNote }
          case 'scott-rao-drawdown':
            return { label: t.steps.scottRaoV60.drawdown, note: t.steps.scottRaoV60.drawdownNote }
          default:
            return { label: step.label, note: step.note }
        }
      case 'lanceHedrick': {
        if (step.id === 'lance-hedrick-drawdown') {
          return { label: t.steps.lanceHedrickV60.drawdown, note: t.steps.lanceHedrickV60.drawdownNote }
        }
        const match = /^lance-hedrick-(pour|spin)-(\d)$/.exec(step.id)
        if (match) {
          const index = Number(match[2])
          if (match[1] === 'pour') {
            return {
              label: t.steps.lanceHedrickV60.pourLabel(index + 1),
              note: index >= 2 ? t.steps.lanceHedrickV60.fastPourNote : undefined,
            }
          }
          return { label: t.steps.lanceHedrickV60.spinLabel, note: t.steps.lanceHedrickV60.spinNotes[index] }
        }
        return { label: step.label, note: step.note }
      }
      default:
        return {
          label: t.steps.v60.pourLabel(pourIndex + 1),
          note: pourIndex === 0 ? t.steps.v60.firstPourNote : undefined,
        }
    }
  }

  switch (variant) {
    case 'hoffmann':
      switch (step.id) {
        case 'hoffmann-fp-pour':
          return { label: t.steps.hoffmannFrenchPress.pour, note: t.steps.hoffmannFrenchPress.pourNote }
        case 'hoffmann-fp-settle':
          return { label: t.steps.hoffmannFrenchPress.settle, note: t.steps.hoffmannFrenchPress.settleNote }
        case 'hoffmann-fp-break-crust':
          return { label: t.steps.hoffmannFrenchPress.breakCrust, note: t.steps.hoffmannFrenchPress.breakCrustNote }
        case 'hoffmann-fp-rest-more':
          return { label: t.steps.hoffmannFrenchPress.restMore, note: t.steps.hoffmannFrenchPress.restMoreNote }
        case 'hoffmann-fp-plunge':
          return { label: t.steps.hoffmannFrenchPress.plunge, note: t.steps.hoffmannFrenchPress.plungeNote }
        default:
          return { label: step.label, note: step.note }
      }
    case 'scottRao':
      switch (step.id) {
        case 'scott-rao-fp-pour':
          return { label: t.steps.scottRaoFrenchPress.pour, note: t.steps.scottRaoFrenchPress.pourNote }
        case 'scott-rao-fp-rest-plunger':
          return { label: t.steps.scottRaoFrenchPress.restPlunger, note: t.steps.scottRaoFrenchPress.restPlungerNote }
        case 'scott-rao-fp-plunge':
          return { label: t.steps.scottRaoFrenchPress.plunge, note: t.steps.scottRaoFrenchPress.plungeNote }
        case 'scott-rao-fp-settle':
          return { label: t.steps.scottRaoFrenchPress.settle, note: t.steps.scottRaoFrenchPress.settleNote }
        default:
          return { label: step.label, note: step.note }
      }
    case 'gwilymDavies':
      switch (step.id) {
        case 'gwilym-fp-pour':
          return { label: t.steps.gwilymDaviesFrenchPress.pour, note: t.steps.gwilymDaviesFrenchPress.pourNote }
        case 'gwilym-fp-rest-1':
          return { label: t.steps.gwilymDaviesFrenchPress.rest1, note: t.steps.gwilymDaviesFrenchPress.rest1Note }
        case 'gwilym-fp-stir':
          return { label: t.steps.gwilymDaviesFrenchPress.stir, note: t.steps.gwilymDaviesFrenchPress.stirNote }
        case 'gwilym-fp-insert-plunger':
          return {
            label: t.steps.gwilymDaviesFrenchPress.insertPlunger,
            note: t.steps.gwilymDaviesFrenchPress.insertPlungerNote,
          }
        case 'gwilym-fp-rest-2':
          return { label: t.steps.gwilymDaviesFrenchPress.rest2, note: t.steps.gwilymDaviesFrenchPress.rest2Note }
        case 'gwilym-fp-press':
          return { label: t.steps.gwilymDaviesFrenchPress.press, note: t.steps.gwilymDaviesFrenchPress.pressNote }
        case 'gwilym-fp-rest-3':
          return { label: t.steps.gwilymDaviesFrenchPress.rest3, note: t.steps.gwilymDaviesFrenchPress.rest3Note }
        case 'gwilym-fp-pour-out':
          return { label: t.steps.gwilymDaviesFrenchPress.pourOut, note: t.steps.gwilymDaviesFrenchPress.pourOutNote }
        default:
          return { label: step.label, note: step.note }
      }
    default:
      switch (step.id) {
        case 'bloom':
          return { label: t.steps.frenchPress.bloom, note: t.steps.frenchPress.bloomNote }
        case 'main-pour':
          return { label: t.steps.frenchPress.mainPour, note: t.steps.frenchPress.mainPourNote }
        case 'skim':
          return { label: t.steps.frenchPress.skim, note: t.steps.frenchPress.skimNote }
        case 'plunge':
          return { label: t.steps.frenchPress.plunge, note: t.steps.frenchPress.plungeNote }
        default:
          return { label: step.label, note: step.note }
      }
  }
}

/**
 * Grind hints are per-recipe too (Hoffmann's V60 wants a finer grind than
 * Kasuya's 4:6, for example), so this picks the right translated string
 * without unsafe indexing across the differently-shaped grindHint records.
 */
export function translateGrindHint(method: Method, variant: RecipeVariant, t: Translations): string {
  if (method === 'v60') {
    switch (variant) {
      case 'hoffmann':
        return t.schedule.grindHint.v60.hoffmann
      case 'scottRao':
        return t.schedule.grindHint.v60.scottRao
      case 'lanceHedrick':
        return t.schedule.grindHint.v60.lanceHedrick
      default:
        return t.schedule.grindHint.v60.kasuya46
    }
  }
  switch (variant) {
    case 'hoffmann':
      return t.schedule.grindHint.frenchPress.hoffmann
    case 'scottRao':
      return t.schedule.grindHint.frenchPress.scottRao
    case 'gwilymDavies':
      return t.schedule.grindHint.frenchPress.gwilymDavies
    default:
      return t.schedule.grindHint.frenchPress.standard
  }
}
