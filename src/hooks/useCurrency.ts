import { useContext } from 'react'
import { CurrencyContext, type CurrencyContextValue } from '../contexts/CurrencyContext'

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider')
  return ctx
}
