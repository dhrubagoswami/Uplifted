import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  mode: ThemeMode
  dark: boolean
  setMode: (mode: ThemeMode) => void
  toggleDark: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const dark = mode === 'system' ? systemDark : mode === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      dark,
      setMode,
      toggleDark: () => setMode(dark ? 'light' : 'dark'),
    }),
    [mode, dark],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
