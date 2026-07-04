# Cafe Helper — "Organic Terrazzo" Design System

Documentation for the visual system built in this conversation: a warm, earthy rework of the brew-calculator UI, moving away from a flat "coffee brown" look toward an organic, hand-crafted feel (asymmetric shapes, a multi-hue palette pulled from a boho-living-room reference, and a wonky serif/rounded-sans type pairing).

All tokens live in `src/index.css` under `:root`. All components are plain CSS classes (no CSS-in-JS, no Tailwind) applied from `src/App.tsx` and `src/components/*.tsx`.

---

## 1. Design Tokens

### Color

| Token | Value | Role |
|---|---|---|
| `--bg` | `#f4ede0` | Page background ("bleached linen") |
| `--surface` | `#fbf6ec` | Card background |
| `--surface-hover` | `#efe4d0` | Hover fill for neutral buttons |
| `--border` | `#e3d7c2` | Default hairline border |
| `--text` | `#3b2f26` | Body text ("walnut ink") |
| `--text-muted` | `#8d7c68` | Secondary text, labels |
| `--accent` | `#a24d2c` | Primary action color ("burnt clay") |
| `--accent-strong` | `#8a3f22` | Primary hover / high-contrast numerals |
| `--accent-secondary` | `#c2933c` | Ochre — decorative fills, blobs |
| `--accent-secondary-strong` | `#96701f` | Ochre darkened for AA-safe text on light surfaces |
| `--accent-secondary-tint` | `#efdcae` | Pale ochre — timer badge background |
| `--accent-tertiary` | `#5f6b47` | Moss — secondary/neutral actions, "done" state |
| `--accent-tertiary-tint` | `#dfe6cc` | Pale moss — hover fill, saved-confirmation background |
| `--decorative` | `#d3b483` | Rattan tan (low-contrast; reserved for texture, not text) |
| `--danger` | `#8f3324` | Delete / destructive actions |

**Semantic color rule established in this system:** clay = primary/active interactive state (used consistently across every segmented control and primary button, never varied — this is what makes the multi-select forms learnable). Moss and ochre are reserved for decoration, secondary actions, and non-interactive data (stat values, "done" state, confirmations) so the palette reads as more than one hue without confusing what's clickable.

### Radius

| Token | Value | Usage |
|---|---|---|
| `--radius` | `16px` | Fallback / mobile grid segmented control |
| `--radius-organic-a` | `22px 14px 22px 14px` | Default card corner treatment |
| `--radius-organic-b` | `14px 22px 14px 22px` | Alternate asymmetric corner (available, not yet applied) |
| `--radius-pill` | `999px` | Buttons, segmented controls, badges |

Inputs, stat tiles, list items, and note boxes each use one-off asymmetric pairs (e.g. `14px 8px 14px 8px`, `16px 10px 16px 10px`) rather than the shared tokens — organic asymmetry is applied per-component rather than globally uniform, which is intentional (perfectly uniform corners would undercut the "hand-shaped" feel) but does mean new components should pick a similar asymmetric pair rather than defaulting to a single radius.

### Typography

| Font | Weight(s) loaded | Usage |
|---|---|---|
| Fraunces (variable, `ital,opsz,wght`) | 300–700, italic | App title (`h1`, weight 600) and tagline (italic) only — the "voice" font |
| Nunito | 400, 500, 600, 700, 800 | Everything else: body, labels, buttons, numerals, card eyebrows (800) |

Loaded via Google Fonts `<link>` in `index.html` (not self-hosted). Fraunces is deliberately scoped to two elements only — it's a display/voice font, not meant for dense UI text at small sizes.

### Decorative motifs

- **Leaf glyph**: a `0% 100% 0% 100%` border-radius square, rotated/mirrored via `::before`/`::after`, in moss. Used flanking the `h1` and as a bullet on `.recipe-list__item`.
- **Blob shapes**: asymmetric `border-radius` pairs like `44% 56% 60% 40% / 50% 40% 60% 50%`, low opacity (0.16–0.4), positioned at negative offsets so they bleed off an edge. Applied at three scales: page-level (`body::before/after`, largest), header-level (`.app__header::before/after`), and card-level (`.card--feature::before/after`, only on the three "hero" screens — setup, preview, timer — not on utility cards like the actions row or saved-recipes list).

---

## 2. Components

### Button (`.btn`)

| Variant | Class | Background | Border | Text |
|---|---|---|---|---|
| Secondary (default) | `.btn` | `--surface-hover` | `--accent-tertiary` (moss) | `--text` |
| Primary | `.btn.btn--primary` | `--accent` (clay) | `--accent` | `--surface` |
| Ghost | `.btn.btn--ghost` | transparent | none | `--text-muted` |
| Danger | `.btn.btn--danger` | inherits secondary | `--danger` | `--danger` |

Sizes: `.btn--large` (18px/16px padding, 1.1rem), default, `.btn--small` (7px/14px padding, 0.8rem).

**States**: hover → secondary fills with `--accent-tertiary-tint`, primary darkens to `--accent-strong`. Focus-visible → 2px `--accent` outline, 2px offset (applies to all buttons and inputs).

**Known pitfall (fixed in this system):** small/ghost buttons must set `flex: 0 0 auto` (not `flex: 0` with `min-width: 0`), or a pill-radius button collapses toward a clipped circle because `flex-basis: 0%` gives the box no content-based width to fall back on. Any new small pill button should copy `.btn--small`'s sizing, not reinvent it.

**Do / Don't**

| ✅ Do | ❌ Don't |
|---|---|
| Use clay (`.btn--primary`) for exactly one primary action per view | Use `.btn--primary` for more than one action in the same `.actions` row |
| Let `.btn--ghost` sit flush with the card edge via its negative margin | Add a `.btn--ghost` without checking it still aligns with card padding — its `margin: -6px 0 -6px -14px` assumes the default padding values |

### SegmentedControl (`.segmented`)

Radio-group pattern (`role="radiogroup"` / `role="radio"`), pill container, pill options, active option filled clay with `--surface`-colored text. Every segmented control in the app (method, recipe, solve-for, roast, flavor, strength, language) uses the same active-color language — this consistency is deliberate (see semantic color rule above).

Two responsive treatments exist:
- Default: `flex-wrap: wrap`.
- `mobileColumns` prop (renders `.segmented--grid`, sets `--segmented-cols`): below 480px, switches to a CSS grid with a fixed column count instead of wrapping — for controls with more options than comfortably wrap (e.g. 4-way recipe picker).

A compact variant (`.app__lang .segmented`) is scoped for the 2-option language switch: `flex-wrap: nowrap`, no `min-width` on options, tighter padding. (This was a bug fix — the default `.segmented__option` `min-width: 70px` doesn't fit two options inside a narrow container and was wrapping to two rows.)

### Card (`.card`, `.card--feature`)

Base `.card`: surface background, 1px border, `--radius-organic-a`, 16px padding, column flex with 14px gap.

`.card--feature` modifier: adds two absolutely-positioned corner blobs (moss top-right, ochre bottom-left), `overflow: hidden` to clip them, and forces direct children to `z-index: 1` so content stays above the decoration. Applied only to `RecipeForm`, `ScheduleView`, and `TimerView`'s root card — the three primary-flow screens — not to the actions card or `SavedRecipes`, to keep the decoration from feeling repetitive.

`.card__title`: uppercase eyebrow label (e.g. "Saved recipes"), ochre, weight 800.

### Stat grid (`.stats` / `.stat`)

2-column grid (4-column ≥480px). Each `.stat__value` defaults to clay (`--accent-strong`); the 3rd tile (water temperature) is recolored ochre and the 4th (total time) moss, via `nth-child`. This is the one place color is used purely for visual variety rather than interactive state — deliberately, since these are passive read-only numbers, not controls.

### Timer (`.timer`, `.timer__*`)

- `.timer__clock`: a fixed 168×168px flex-centered blob (asymmetric `border-radius`, pale-ochre fill) rather than plain text — the one "hero" numeral treatment in the app.
- `.timer__step` / `--current` / `--done`: three-state list item. Upcoming = neutral `--bg`. Current = clay fill. Done = moss fill at 0.75 opacity — reusing the same semantic mapping as the stat grid (moss = completed/calm).
- `.timer__saved-note`: pale-moss pill, shown after a recipe is saved from the finished-brew screen (see pattern below).

### Recipe list (`.recipe-list__item`)

Flex row, moss leaf-bullet (`::before`, absolutely positioned so it doesn't disturb the `justify-content: space-between` layout between name and actions), asymmetric radius matching `.stat`.

---

## 3. Patterns

### Save-recipe flow

Two entry points now save a recipe, sharing one underlying handler (`App.tsx`'s `handleSaveRequest`, which builds a `SavedRecipe` from the current `input` and appends to the persisted list):

1. **From the setup screen** — `Save recipe` button sets `pendingSave`, which reveals a name-input `.save-form` inside the persistent `SavedRecipes` card.
2. **From the finished-brew screen** — `TimerView` now renders its own local three-state flow once `isDone`: a `Save this recipe` primary button → an inline `.save-form` (name input + Save/Cancel) → a `.timer__saved-note` confirmation. This avoids navigating away from the "brew complete" screen, which is the point in the flow where a user is most likely to want to save what they just brewed.

Both flows reuse the same `.save-form` styling and the same `t.saved.*` copy keys, so the interaction pattern is visually identical no matter where it's triggered — a new "save" entry point elsewhere should follow the same three-state shape (idle button → inline form → confirmation) rather than introducing a modal or a route change.

### Multi-step stacked form

`RecipeForm` is a single `.card--feature` containing six `.field` + `SegmentedControl` pairs stacked vertically, conditionally showing flavor/strength only `recipeSupportsFlavorStrength(input)`. No accordion/tabs — the whole form is always visible, favoring scannability over compactness.

---

## 4. Accessibility notes

- Segmented controls use `role="radiogroup"` / `role="radio"` / `aria-checked` — keyboard and screen-reader semantics are correct even though visually they're pill buttons.
- Text-on-fill combinations were deliberately re-picked for contrast: `--accent-secondary` (ochre, `#c2933c`) is too light for small text on cream, so a separate `--accent-secondary-strong` (`#96701f`) token exists specifically for that use (stat values, card eyebrow) — don't use the base `--accent-secondary` for text, only for larger fills/blobs.
- All interactive elements get a 2px `--accent` focus-visible outline; this wasn't changed from the original file and should be preserved on any new control.
- Pill buttons/segments keep ~36–44px effective tap targets via padding, not by shrinking below the original rectangular button sizing.

---

## 5. Open items / not yet done

- No dark-mode variant exists yet (the whole system assumes `color-scheme: light`).
- Fraunces supports optional `SOFT`/`WONK` variable axes for an even wonkier serif; only the standard `ital,opsz,wght` axes are currently loaded.
- `--radius-organic-b` is defined but unused — available if a component wants the mirrored asymmetry instead of `-a`.
- Tokens live only in one hand-written `index.css`; if the component count grows much further it may be worth splitting tokens into their own file, but there's no build-tooling reason to do that yet (no Sass/PostCSS pipeline in this project).
