import { useState } from 'react'
import type { RecipeInput } from '../domain/types'
import { useLanguage } from '../i18n/LanguageContext'

export interface SavedRecipe {
  id: string
  name: string
  input: RecipeInput
}

interface Props {
  recipes: SavedRecipe[]
  onLoad: (recipe: SavedRecipe) => void
  onDelete: (id: string) => void
  onSaveRequest: (name: string) => void
  pendingSave: boolean
  onCancelSave: () => void
}

export function SavedRecipes({ recipes, onLoad, onDelete, onSaveRequest, pendingSave, onCancelSave }: Props) {
  const { t } = useLanguage()
  const [name, setName] = useState('')

  if (!pendingSave && recipes.length === 0) return null

  return (
    <div className="card">
      <h2 className="card__title">{t.saved.title}</h2>

      {pendingSave && (
        <form
          className="save-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            onSaveRequest(name.trim())
            setName('')
          }}
        >
          <input
            autoFocus
            type="text"
            placeholder={t.saved.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn btn--primary">
            {t.saved.save}
          </button>
          <button type="button" className="btn" onClick={onCancelSave}>
            {t.saved.cancel}
          </button>
        </form>
      )}

      {recipes.length > 0 && (
        <ul className="recipe-list">
          {recipes.map((r) => (
            <li key={r.id} className="recipe-list__item">
              <span>{r.name}</span>
              <div className="recipe-list__actions">
                <button type="button" className="btn btn--small" onClick={() => onLoad(r)}>
                  {t.saved.load}
                </button>
                <button type="button" className="btn btn--small btn--danger" onClick={() => onDelete(r.id)}>
                  {t.saved.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
