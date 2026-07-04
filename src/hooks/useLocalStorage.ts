import { useEffect, useState } from 'react'

/**
 * Same API as useState, but persisted to localStorage under `key`.
 * Safe to use in SSR/older browsers: falls back to in-memory state if
 * localStorage is unavailable (e.g. private browsing quota errors).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : initialValue
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota / privacy-mode errors; app still works in-memory.
    }
  }, [key, value])

  return [value, setValue] as const
}
