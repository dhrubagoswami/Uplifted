import { useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart'] as const
const WARNING_MS = 10_000

export interface UseIdleTimeoutResult {
  /** True during the warning window before onIdle fires. */
  warning: boolean
  /** Resets the idle timer, e.g. from the warning modal's "I'm still here" action. */
  reset: () => void
}

/** Fires onIdle after `timeoutMs` of no pointer/key/touch activity, with a 10s warning window first. */
export function useIdleTimeout(timeoutMs: number, onIdle: () => void): UseIdleTimeoutResult {
  const [warning, setWarning] = useState(false)
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function clearTimers() {
      if (warningTimer.current) clearTimeout(warningTimer.current)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }

    function schedule() {
      clearTimers()
      setWarning(false)
      warningTimer.current = setTimeout(() => setWarning(true), timeoutMs - WARNING_MS)
      idleTimer.current = setTimeout(onIdle, timeoutMs)
    }

    function onActivity() {
      schedule()
    }

    schedule()
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, onActivity))
    return () => {
      clearTimers()
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity))
    }
  }, [timeoutMs, onIdle])

  return {
    warning,
    reset: () => {
      setWarning(false)
      window.dispatchEvent(new Event('pointermove'))
    },
  }
}
