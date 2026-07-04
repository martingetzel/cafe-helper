import { useCallback, useEffect, useRef, useState } from 'react'
import type { PourStep } from '../domain/types'

interface UseTimerOptions {
  steps: PourStep[]
  onStepStart?: (step: PourStep, index: number) => void
}

/**
 * Stopwatch-style brew timer. Polls Date.now() instead of chaining
 * setTimeouts, so a throttled/backgrounded tab still "catches up" correctly
 * and fires every step exactly once instead of drifting or double-firing.
 */
export function useTimer({ steps, onStepStart }: UseTimerOptions) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)

  const startRef = useRef<number | null>(null)
  const baseElapsedRef = useRef(0)
  const firedRef = useRef<Set<string>>(new Set())
  const onStepStartRef = useRef(onStepStart)
  onStepStartRef.current = onStepStart

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const now = Date.now()
      const currentElapsed = baseElapsedRef.current + (now - (startRef.current ?? now)) / 1000
      setElapsed(currentElapsed)
      steps.forEach((step, i) => {
        if (!firedRef.current.has(step.id) && currentElapsed >= step.atSeconds) {
          firedRef.current.add(step.id)
          onStepStartRef.current?.(step, i)
        }
      })
    }, 200)
    return () => window.clearInterval(id)
  }, [running, steps])

  const start = useCallback(() => {
    startRef.current = Date.now()
    baseElapsedRef.current = 0
    firedRef.current = new Set()
    setElapsed(0)
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (running && startRef.current !== null) {
      baseElapsedRef.current += (Date.now() - startRef.current) / 1000
    }
    setRunning(false)
  }, [running])

  const resume = useCallback(() => {
    startRef.current = Date.now()
    setRunning(true)
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    startRef.current = null
    baseElapsedRef.current = 0
    firedRef.current = new Set()
    setElapsed(0)
  }, [])

  let currentStepIndex = -1
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].atSeconds <= elapsed) currentStepIndex = i
  }
  const nextStep = steps.find((s) => s.atSeconds > elapsed) ?? null

  return { elapsed, running, start, pause, resume, reset, currentStepIndex, nextStep }
}
