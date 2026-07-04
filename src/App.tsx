import { useMemo, useState } from 'react'
import type { RecipeInput } from './domain/types'
import { calculateBrewPlan } from './domain'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useLanguage } from './i18n/LanguageContext'
import { RecipeForm } from './components/RecipeForm'
import { ScheduleView } from './components/ScheduleView'
import { TimerView } from './components/TimerView'
import { SavedRecipes, type SavedRecipe } from './components/SavedRecipes'
import { SegmentedControl } from './components/SegmentedControl'

const DEFAULT_INPUT: RecipeInput = {
  method: 'v60',
  v60Recipe: 'kasuya46',
  frenchPressRecipe: 'standard',
  solveFor: 'coffee',
  coffeeGrams: 20,
  totalWaterGrams: 300,
  ratio: 15,
  roast: 'medium',
  flavor: 'standard',
  strength: 'medium',
  grinderNote: '',
}

type View = 'setup' | 'preview' | 'timer'

function App() {
  const { lang, setLang, t } = useLanguage()
  const [storedInput, setInput] = useLocalStorage<RecipeInput>('cafe-helper:last-input', DEFAULT_INPUT)
  // Merge over defaults so adding new fields later never breaks a recipe
  // someone already has saved in their browser's localStorage.
  const input: RecipeInput = { ...DEFAULT_INPUT, ...storedInput }
  const [recipes, setRecipes] = useLocalStorage<SavedRecipe[]>('cafe-helper:recipes', [])
  const [view, setView] = useState<View>('setup')
  const [pendingSave, setPendingSave] = useState(false)

  const plan = useMemo(() => calculateBrewPlan(input), [input])

  function updateInput(patch: Partial<RecipeInput>) {
    setInput((prev) => ({ ...prev, ...patch }))
  }

  function handleSaveRequest(name: string) {
    const recipe: SavedRecipe = { id: crypto.randomUUID(), name, input }
    setRecipes((prev) => [...prev, recipe])
    setPendingSave(false)
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__lang">
          <SegmentedControl
            name="language"
            value={lang}
            onChange={setLang}
            options={[
              { value: 'en', label: 'EN' },
              { value: 'es', label: 'ES' },
            ]}
          />
        </div>
        <h1>{t.app.title}</h1>
        <p>{t.app.tagline}</p>
      </header>

      {view === 'setup' && (
        <>
          <RecipeForm input={input} onChange={updateInput} />
          <div className="card">
            <div className="actions">
              <button type="button" className="btn btn--primary btn--large" onClick={() => setView('preview')}>
                {t.form.previewRecipe}
              </button>
              <button type="button" className="btn" onClick={() => setPendingSave(true)}>
                {t.schedule.saveRecipe}
              </button>
            </div>
          </div>
          <SavedRecipes
            recipes={recipes}
            pendingSave={pendingSave}
            onCancelSave={() => setPendingSave(false)}
            onSaveRequest={handleSaveRequest}
            onLoad={(r) => setInput(r.input)}
            onDelete={(id) => setRecipes((prev) => prev.filter((r) => r.id !== id))}
          />
        </>
      )}

      {view === 'preview' && (
        <ScheduleView plan={plan} onBack={() => setView('setup')} onStart={() => setView('timer')} />
      )}

      {view === 'timer' && <TimerView plan={plan} onExit={() => setView('preview')} />}

      <footer className="app__footer">{t.app.footer}</footer>
    </div>
  )
}

export default App
