# Café Helper

A brew calculator and pour timer for V60 and French press, built as a static React + Vite PWA for GitHub Pages. Available in English and Spanish.

## What it does

- Pick a method (V60 or French press), then a specific recipe for that method.
- Solve for coffee weight (given ratio + total water) or for total water (given ratio + coffee weight).
- Set roast level, and for recipes that support it, flavor (sweet/standard/bright) and strength (light/medium/strong).
- Preview the full pour-by-pour schedule before brewing: timing, water per step, running total, water temperature, grind hint, and a source link for the recipe.
- Start a full-screen timer that beeps (synthesized, no audio files) and vibrates at each step, shows the current and next step's instructions, and keeps the screen awake while brewing.
- Save named recipes to your browser (localStorage) and reload them later.
- Installable as a PWA and works offline once loaded.

## Screens

The app flow is three steps:

1. **Setup** — `RecipeForm`: choose method, recipe, solve-for mode, weights/ratio, roast, and (when applicable) flavor/strength. "Preview recipe" moves on; "Save recipe" stores the current parameters.
2. **Preview** — `ScheduleView`: read-only computed schedule with stats, grind hint, full step table, and the recipe's source link. "← Edit parameters" goes back to Setup; "Start timer" moves on.
3. **Timer** — `TimerView`: live countdown with the current step's note, the next step's note, and a scrollable list of all steps. Exiting returns to Preview.

## Recipes

**V60:**

| Recipe | Notes | Source |
|---|---|---|
| Tetsu Kasuya's 4:6 method | Front 40% split across 2 pours (flavor controls the split), back 60% split into 1–3 pours (strength controls the count) | [pullandpourcoffee.com](https://pullandpourcoffee.com/v60-4-to-6-method-pour-over/) |
| James Hoffmann — Ultimate V60 | Fixed 3-pour schedule (bloom 12% → 60% → 100%), stir + swirl, 3:30 total | [timer.coffee](https://www.timer.coffee/recipes/v60/james-hoffman-v60-recipe/) |
| Scott Rao — Classic V60 | Bloom (3x coffee weight) + one continuous main pour, stir, spin, 3:00 total | [timer.coffee](https://www.timer.coffee/recipes/v60/scott-rao-classic-v60-recipe/) |
| Lance Hedrick — Easy and Effective | Four pour checkpoints each followed by a spin, spins get progressively lighter, 3:30 total | [timer.coffee](https://www.timer.coffee/recipes/v60/easy-and-effective-v60-by-lance-hedrick/) |

**French press:**

| Recipe | Notes | Source |
|---|---|---|
| Standard (SCA-style) | Bloom, remaining water, steep (3:30/4:00/4:30 by strength), break crust & skim, plunge | [mugcult.com](https://mugcult.com/guides/french-press-brewing-guide) |
| James Hoffmann | All water at once, long 9:45 steep, break crust and rest again before plunging — the plunger only touches the surface, it is never pressed to the bottom | [timer.coffee](https://www.timer.coffee/recipes/french-press/james-hoffmann-french-press-recipe/) |
| Scott Rao | All water at once, plunger rested just below the surface almost immediately, 4:20 steep, gentle plunge, 5:20 total | [timer.coffee](https://www.timer.coffee/recipes/french-press/scott-rao-french-press-recipe/) |
| Gwilym Davies | Long, low-sediment method: pour, rest, stir, insert (don't press) plunger, rest, press slowly, rest, pour out, 12:45 total | [timer.coffee](https://www.timer.coffee/recipes/french-press/gwilym-davies-french-press-recipe/) |

Flavor and strength controls only appear for Kasuya's 4:6 and the standard French press — the other six recipes are fixed schedules from their original sources.

## Architecture

- `src/domain/` — pure calculation logic, no UI or language dependency. `types.ts` defines the shared shapes (`RecipeInput`, `BrewPlan`, `PourStep`, `RecipeSource`); `v60.ts` and `frenchPress.ts` each export one `calculate*` function per recipe plus a dispatcher (`calculateV60`, `calculateFrenchPress`); `index.ts` resolves coffee/water depending on `solveFor` and exposes `calculateBrewPlan` as the single entry point.
- `src/i18n/` — custom lightweight i18n (React Context + plain object dictionaries, no library). `translations.ts` holds the EN/ES dictionaries; `steps.ts` translates each domain step (`translateStep`) and grind hint (`translateGrindHint`) into the active language, keyed off method + recipe variant.
- `src/components/` — `RecipeForm`, `ScheduleView`, `TimerView`, `SavedRecipes`, `SegmentedControl`.
- `src/hooks/useLocalStorage.ts`, `src/hooks/useTimer.ts` — persistence and the drift-tolerant timer (uses `Date.now()` polling rather than chained `setTimeout`s, so it stays accurate even if the tab is backgrounded).

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds the app and publishes it via GitHub Pages on every push to `main`.

One-time setup on GitHub:

1. Push this repo to GitHub (if not already).
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys automatically. Your app will be live at `https://<your-username>.github.io/cafe-helper/`.

If you rename the repository, update `base` in `vite.config.ts` and `start_url`/`scope` in the PWA manifest to match the new repo name.

## Possible next steps

- Add more methods (Aeropress, Chemex) using the same `RecipeInput` → `BrewPlan` pattern in `src/domain/`.
- Brew history log (not just saved recipes) with tasting notes per brew.
- Additional languages beyond EN/ES.
