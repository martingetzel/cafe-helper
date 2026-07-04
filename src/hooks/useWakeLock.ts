import { useEffect, useRef } from 'react'

interface WakeLockSentinelLike {
  release: () => Promise<void>
}

/**
 * Keeps the screen awake while `active` is true (e.g. during a brew timer),
 * using the Screen Wake Lock API where supported. No-ops silently on
 * browsers without support (Safari < 16.4, most non-Chromium mobile).
 */
export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null)

  useEffect(() => {
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> }
    }
    if (!active || !nav.wakeLock) return

    let cancelled = false
    nav.wakeLock
      .request('screen')
      .then((sentinel) => {
        if (cancelled) {
          void sentinel.release()
        } else {
          sentinelRef.current = sentinel
        }
      })
      .catch(() => {
        // Ignore: e.g. tab not visible, or user denied. Timer still works.
      })

    return () => {
      cancelled = true
      void sentinelRef.current?.release()
      sentinelRef.current = null
    }
  }, [active])
}
