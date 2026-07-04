import { useEffect, useState } from 'react'
import type { BrewPlan } from '../domain/types'
import { formatClock, getRecipeVariant } from '../domain'
import { useTimer } from '../hooks/useTimer'
import { useWakeLock } from '../hooks/useWakeLock'
import { playFinishAlert, playPourAlert, unlockAudio } from '../audio/beep'
import { useLanguage } from '../i18n/LanguageContext'
import { translateStep } from '../i18n/steps'

interface Props {
  plan: BrewPlan
  onExit: () => void
  onSaveRecipe: (name: string) => void
}

export function TimerView({ plan, onExit, onSaveRecipe }: Props) {
  const { t } = useLanguage()
  const [savingRecipe, setSavingRecipe] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const variant = getRecipeVariant(plan.input)
  const { elapsed, running, start, pause, resume, reset, currentStepIndex, nextStep } = useTimer({
    steps: plan.steps,
    onStepStart: (step) => {
      const isLast = step.id === plan.steps[plan.steps.length - 1].id
      if (isLast) {
        playFinishAlert()
      } else {
        playPourAlert()
      }
      if (navigator.vibrate) navigator.vibrate(isLast ? [120, 60, 120, 60, 200] : [120, 60, 120])
    },
  })

  useWakeLock(running)

  const isDone = plan.totalTimeSeconds > 0 && elapsed >= plan.totalTimeSeconds
  const countdown = nextStep ? Math.max(0, Math.ceil(nextStep.atSeconds - elapsed)) : null
  const nextStepIndex = nextStep ? plan.steps.indexOf(nextStep) : -1

  const currentStep = currentStepIndex >= 0 ? translateStep(plan.steps[currentStepIndex], plan.method, variant, currentStepIndex, t) : null
  const nextStepTranslated = nextStep ? translateStep(nextStep, plan.method, variant, nextStepIndex, t) : null
  const currentCumulativeWater = currentStepIndex >= 0 ? plan.steps[currentStepIndex].cumulativeWaterGrams : null

  // Stop polling once the brew is done instead of ticking forever in the background.
  useEffect(() => {
    if (isDone && running) pause()
  }, [isDone, running, pause])

  return (
    <div className="card timer card--feature">
      <button type="button" className="btn btn--ghost timer__exit" onClick={onExit}>
        {t.timer.backToRecipe}
      </button>

      <div className="timer__clock">
        <span className="timer__clock-time">{formatClock(Math.floor(elapsed))}</span>
        {currentCumulativeWater !== null && <span className="timer__clock-water">{currentCumulativeWater}g</span>}
      </div>

      <div className="timer__status">{isDone ? t.timer.done : currentStep ? t.timer.now(currentStep.label) : t.timer.ready}</div>

      {isDone && !justSaved && !savingRecipe && (
        <button type="button" className="btn btn--primary" onClick={() => setSavingRecipe(true)}>
          {t.timer.saveRecipe}
        </button>
      )}

      {isDone && savingRecipe && (
        <form
          className="save-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!recipeName.trim()) return
            onSaveRecipe(recipeName.trim())
            setSavingRecipe(false)
            setJustSaved(true)
          }}
        >
          <input
            autoFocus
            type="text"
            placeholder={t.saved.namePlaceholder}
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
          <button type="submit" className="btn btn--primary">
            {t.saved.save}
          </button>
          <button type="button" className="btn" onClick={() => setSavingRecipe(false)}>
            {t.saved.cancel}
          </button>
        </form>
      )}

      {isDone && justSaved && <div className="timer__saved-note">{t.timer.savedConfirmation}</div>}

      {!isDone && currentStep?.note && <div className="timer__current-note">{currentStep.note}</div>}

      {!isDone && nextStep && nextStepTranslated && (
        <div className="timer__next">
          {t.timer.next(countdown ?? 0, nextStepTranslated.label, nextStep.waterGrams > 0 ? nextStep.waterGrams : null)}
          {nextStepTranslated.note && <div className="timer__next-note">{nextStepTranslated.note}</div>}
        </div>
      )}

      <ol className="timer__steps">
        {plan.steps.map((step, i) => {
          const { label, note } = translateStep(step, plan.method, variant, i, t)
          return (
            <li
              key={step.id}
              className={
                i < currentStepIndex || isDone
                  ? 'timer__step timer__step--done'
                  : i === currentStepIndex
                    ? 'timer__step timer__step--current'
                    : 'timer__step'
              }
            >
              <div className="timer__step-row">
                <span className="timer__step-time">{formatClock(step.atSeconds)}</span>
                <span className="timer__step-label">{label}</span>
                <span className="timer__step-grams">{step.waterGrams > 0 ? `${step.waterGrams}g` : ''}</span>
              </div>
              {note && <div className="timer__step-note">{note}</div>}
            </li>
          )
        })}
      </ol>

      <div className="actions">
        {!running && elapsed === 0 && (
          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={() => {
              unlockAudio()
              start()
            }}
          >
            {t.timer.start}
          </button>
        )}
        {running && (
          <button type="button" className="btn btn--large" onClick={pause}>
            {t.timer.pause}
          </button>
        )}
        {!running && elapsed > 0 && !isDone && (
          <button type="button" className="btn btn--primary btn--large" onClick={resume}>
            {t.timer.resume}
          </button>
        )}
        {elapsed > 0 && (
          <button type="button" className="btn btn--large" onClick={reset}>
            {t.timer.reset}
          </button>
        )}
      </div>
    </div>
  )
}
