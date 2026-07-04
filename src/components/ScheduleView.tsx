import type { BrewPlan } from '../domain/types'
import { formatClock, getRecipeVariant } from '../domain'
import { useLanguage } from '../i18n/LanguageContext'
import { translateStep, translateGrindHint } from '../i18n/steps'

interface Props {
  plan: BrewPlan
  onStart: () => void
  onBack: () => void
}

export function ScheduleView({ plan, onStart, onBack }: Props) {
  const { t } = useLanguage()
  const isSolvingForWater = plan.input.solveFor === 'water'
  const waterOffTarget = isSolvingForWater && plan.totalWaterGrams !== Math.round(plan.input.totalWaterGrams)
  const variant = getRecipeVariant(plan.input)

  return (
    <div className="card card--feature">
      <button type="button" className="btn btn--ghost" onClick={onBack}>
        {t.schedule.backToEdit}
      </button>

      <div className="stats">
        <div className="stat">
          <span className="stat__value">{plan.input.coffeeGrams}g</span>
          <span className="stat__label">{t.schedule.coffeeWeight}</span>
        </div>
        <div className="stat">
          <span className="stat__value">{plan.totalWaterGrams}g</span>
          <span className="stat__label">{t.schedule.totalWater}</span>
        </div>
        <div className="stat">
          <span className="stat__value">{plan.waterTempC}°C</span>
          <span className="stat__label">{t.schedule.waterTemp}</span>
        </div>
        <div className="stat">
          <span className="stat__value">{formatClock(plan.totalTimeSeconds)}</span>
          <span className="stat__label">{t.schedule.totalTime}</span>
        </div>
      </div>

      {waterOffTarget && (
        <p className="grind-hint">
          {t.schedule.roundingNote(plan.input.coffeeGrams, plan.totalWaterGrams, plan.input.totalWaterGrams)}
        </p>
      )}

      <p className="grind-hint">
        {t.schedule.grindPrefix} {translateGrindHint(plan.method, variant, t)}
      </p>

      <table className="schedule">
        <thead>
          <tr>
            <th>{t.schedule.table.time}</th>
            <th>{t.schedule.table.step}</th>
            <th>{t.schedule.table.water}</th>
            <th>{t.schedule.table.total}</th>
          </tr>
        </thead>
        <tbody>
          {plan.steps.map((step, i) => {
            const { label, note } = translateStep(step, plan.method, variant, i, t)
            return (
              <tr key={step.id}>
                <td>{formatClock(step.atSeconds)}</td>
                <td>
                  {label}
                  {note ? <div className="schedule__note">{note}</div> : null}
                </td>
                <td>{step.waterGrams > 0 ? `${step.waterGrams}g` : '—'}</td>
                <td>{step.cumulativeWaterGrams}g</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <p className="source-note">
        {t.schedule.sourceLabel}{' '}
        <a href={plan.source.url} target="_blank" rel="noopener noreferrer">
          {plan.source.name}
        </a>
      </p>

      <div className="actions">
        <button type="button" className="btn btn--primary btn--large" onClick={onStart}>
          {t.schedule.startTimer}
        </button>
      </div>
    </div>
  )
}
