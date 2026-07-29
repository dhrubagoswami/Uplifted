import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Currency } from '../types'
import { formatINR, formatUSD } from '../lib/format'

export interface CurrencyContextValue {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  /** Formats integer paise into the active currency's display string. */
  format: (paise: number) => string
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR')

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      toggleCurrency: () => setCurrency((c) => (c === 'INR' ? 'USD' : 'INR')),
      format: (paise: number) => (currency === 'USD' ? formatUSD(paise) : formatINR(paise)),
    }),
    [currency],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
