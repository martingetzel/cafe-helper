import type { ReactNode } from 'react'
import type { StepKind } from '../domain/types'

/**
 * One small line-icon per StepKind, drawn with `currentColor` so each icon
 * automatically follows the timer__step upcoming/current/done color states
 * without any extra props or CSS overrides.
 *
 * Purely decorative — the step label text is still the real content for
 * screen readers, so this is marked aria-hidden and never carries its own
 * accessible name.
 */
export function StepIcon({ kind, className }: { kind: StepKind; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {ICONS[kind]}
    </svg>
  )
}

const ICONS: Record<StepKind, ReactNode> = {
  pour: (
    <>
      <g fill="currentColor" stroke="none">
        <path d="M12 3 C14.5 6 16 8.2 16 9.8 C16 12.1 14.2 13.8 12 13.8 C9.8 13.8 8 12.1 8 9.8 C8 8.2 9.5 6 12 3 Z" />
        <path d="M17 13 C18.1 14.3 18.6 15.1 18.6 15.9 C18.6 16.8 17.9 17.4 17 17.4 C16.1 17.4 15.4 16.8 15.4 15.9 C15.4 15.1 15.9 14.3 17 13 Z" />
      </g>
      <path
        d="M4 18.5 C5.5 17.3 7 19.5 8.5 18.3 C10 17.1 11.5 19.3 13 18.1 C14.5 16.9 16 19.1 17.5 17.9 C18.5 17.1 19.3 17.5 20 18"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  stir: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path
        d="M16 12 C16 9.8 14.2 8 12 8 C9.2 8 7 10.2 7 13 C7 15.2 8.8 17 11 17 C12.7 17 14 15.7 14 14 C14 12.9 13.2 12 12.1 11.8"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M16 12 L20 8.3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="20.3" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  rest: (
    <>
      <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4 H17" />
        <path d="M7 20 H17" />
        <path d="M7 4 C7 9 12 9.5 12 12 C12 14.5 7 15 7 20" />
        <path d="M17 4 C17 9 12 9.5 12 12 C12 14.5 17 15 17 20" />
      </g>
      <circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  skim: (
    <>
      <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17 C5.5 15.8 7 18 8.5 16.8 C10 15.6 11.5 17.8 13 16.6 C14.5 15.4 16 17.6 17.5 16.4 C18.3 15.8 19 16.1 19.5 16.5" />
        <circle cx="11" cy="11" r="2.7" />
        <path d="M13 9.2 L17.7 4.5" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="10.1" cy="10.2" r="0.42" />
        <circle cx="12" cy="10.6" r="0.42" />
        <circle cx="10.8" cy="12.2" r="0.42" />
      </g>
    </>
  ),
  plunge: (
    <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="9" width="11.5" height="12" rx="2" />
      <path d="M17.5 11.5 C20.3 11.5 20.3 15.5 17.5 15.5" />
      <rect x="6.6" y="7.9" width="10.3" height="1.3" rx="0.65" />
      <path d="M11.7 3 L11.7 13" />
      <path d="M8.5 13 L14.9 13" strokeWidth="2" />
      <path d="M9.7 15.3 L11.7 17.3 L13.7 15.3" />
      <circle cx="11.7" cy="3" r="1.3" fill="none" />
    </g>
  ),
}
