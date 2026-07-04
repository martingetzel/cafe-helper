import type { RecipeInput } from '../domain/types'
import { recipeSupportsFlavorStrength } from '../domain'
import { useLanguage } from '../i18n/LanguageContext'
import { SegmentedControl } from './SegmentedControl'

interface Props {
  input: RecipeInput
  onChange: (patch: Partial<RecipeInput>) => void
}

export function RecipeForm({ input, onChange }: Props) {
  const { t } = useLanguage()
  const showFlavorStrength = recipeSupportsFlavorStrength(input)

  return (
    <div className="card card--feature">
      <div className="field">
        <label>{t.form.method}</label>
        <SegmentedControl
          name="method"
          value={input.method}
          onChange={(method) => onChange({ method })}
          options={[
            { value: 'v60', label: t.form.methodOptions.v60 },
            { value: 'frenchPress', label: t.form.methodOptions.frenchPress },
          ]}
        />
      </div>

      <div className="field">
        <label>{t.form.recipe}</label>
        {input.method === 'v60' ? (
          <SegmentedControl
            name="v60Recipe"
            value={input.v60Recipe}
            onChange={(v60Recipe) => onChange({ v60Recipe })}
            mobileColumns={2}
            options={[
              { value: 'kasuya46', label: t.form.v60RecipeOptions.kasuya46 },
              { value: 'hoffmann', label: t.form.v60RecipeOptions.hoffmann },
              { value: 'scottRao', label: t.form.v60RecipeOptions.scottRao },
              { value: 'lanceHedrick', label: t.form.v60RecipeOptions.lanceHedrick },
            ]}
          />
        ) : (
          <SegmentedControl
            name="frenchPressRecipe"
            value={input.frenchPressRecipe}
            onChange={(frenchPressRecipe) => onChange({ frenchPressRecipe })}
            mobileColumns={2}
            options={[
              { value: 'standard', label: t.form.frenchPressRecipeOptions.standard },
              { value: 'hoffmann', label: t.form.frenchPressRecipeOptions.hoffmann },
              { value: 'scottRao', label: t.form.frenchPressRecipeOptions.scottRao },
              { value: 'gwilymDavies', label: t.form.frenchPressRecipeOptions.gwilymDavies },
            ]}
          />
        )}
      </div>

      <div className="field">
        <label>{t.form.solveFor}</label>
        <SegmentedControl
          name="solveFor"
          value={input.solveFor}
          onChange={(solveFor) => onChange({ solveFor })}
          options={[
            { value: 'coffee', label: t.form.solveForOptions.coffee },
            { value: 'water', label: t.form.solveForOptions.water },
          ]}
        />
      </div>

      <div className="field-row">
        {input.solveFor === 'coffee' ? (
          <div className="field">
            <label htmlFor="coffeeGrams">{t.form.coffeeWeight}</label>
            <input
              id="coffeeGrams"
              type="number"
              min={5}
              max={100}
              step={0.5}
              value={input.coffeeGrams}
              onChange={(e) => onChange({ coffeeGrams: Number(e.target.value) })}
            />
          </div>
        ) : (
          <div className="field">
            <label htmlFor="totalWaterGrams">{t.form.totalWater}</label>
            <input
              id="totalWaterGrams"
              type="number"
              min={50}
              max={2000}
              step={5}
              value={input.totalWaterGrams}
              onChange={(e) => onChange({ totalWaterGrams: Number(e.target.value) })}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="ratio">{t.form.ratio}</label>
          <input
            id="ratio"
            type="number"
            min={10}
            max={20}
            step={0.5}
            value={input.ratio}
            onChange={(e) => onChange({ ratio: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="field">
        <label>{t.form.roast}</label>
        <SegmentedControl
          name="roast"
          value={input.roast}
          onChange={(roast) => onChange({ roast })}
          options={[
            { value: 'light', label: t.form.roastOptions.light },
            { value: 'medium', label: t.form.roastOptions.medium },
            { value: 'dark', label: t.form.roastOptions.dark },
          ]}
        />
      </div>

      {showFlavorStrength && (
        <>
          <div className="field">
            <label>{t.form.flavorLabel(input.method)}</label>
            <SegmentedControl
              name="flavor"
              value={input.flavor}
              onChange={(flavor) => onChange({ flavor })}
              options={[
                { value: 'sweet', label: t.form.flavorOptions.sweet },
                { value: 'standard', label: t.form.flavorOptions.standard },
                { value: 'bright', label: t.form.flavorOptions.bright },
              ]}
            />
          </div>

          <div className="field">
            <label>{t.form.strengthLabel(input.method)}</label>
            <SegmentedControl
              name="strength"
              value={input.strength}
              onChange={(strength) => onChange({ strength })}
              options={[
                { value: 'light', label: t.form.strengthOptions.light },
                { value: 'medium', label: t.form.strengthOptions.medium },
                { value: 'strong', label: t.form.strengthOptions.strong },
              ]}
            />
          </div>
        </>
      )}

      <div className="field">
        <label htmlFor="grinderNote">{t.form.grinderNote}</label>
        <input
          id="grinderNote"
          type="text"
          placeholder={t.form.grinderNotePlaceholder}
          value={input.grinderNote ?? ''}
          onChange={(e) => onChange({ grinderNote: e.target.value })}
        />
      </div>
    </div>
  )
}
