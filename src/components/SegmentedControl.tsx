import type { CSSProperties } from 'react'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  mobileColumns?: number
}

export function SegmentedControl<T extends string>({
  name,
  options,
  value,
  onChange,
  mobileColumns,
}: Props<T>) {
  return (
    <div
      className={`segmented${mobileColumns ? ' segmented--grid' : ''}`}
      style={mobileColumns ? ({ '--segmented-cols': mobileColumns } as CSSProperties) : undefined}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          className={`segmented__option${opt.value === value ? ' segmented__option--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
