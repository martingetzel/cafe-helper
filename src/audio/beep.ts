// Synthesized pour-alert sounds via the Web Audio API. No audio assets
// needed, and it works reliably across browsers/PWAs.

let sharedContext: AudioContext | null = null

function getContext(): AudioContext {
  if (!sharedContext) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    sharedContext = new Ctor()
  }
  return sharedContext
}

/**
 * Must be called from a user gesture (e.g. the "Start" button click) so the
 * browser allows audio to play later without further interaction.
 */
export function unlockAudio() {
  const ctx = getContext()
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
}

function playTone(freq: number, startAt: number, durationSeconds: number, ctx: AudioContext, volume = 0.35) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSeconds)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startAt)
  osc.stop(startAt + durationSeconds + 0.02)
}

/** Regular "start pouring" alert: two short beeps. */
export function playPourAlert() {
  const ctx = getContext()
  const now = ctx.currentTime
  playTone(880, now, 0.15, ctx)
  playTone(880, now + 0.22, 0.15, ctx)
}

/** Final step alert (plunge / brew done): three descending tones. */
export function playFinishAlert() {
  const ctx = getContext()
  const now = ctx.currentTime
  playTone(988, now, 0.18, ctx)
  playTone(784, now + 0.22, 0.18, ctx)
  playTone(659, now + 0.44, 0.32, ctx)
}
