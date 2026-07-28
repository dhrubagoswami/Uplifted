import type { Currency } from '../../types'
import { cn } from '../../lib/cn'

export interface CurrencyToggleProps {
  currency: Currency
  onToggle: () => void
  className?: string
}

export function CurrencyToggle({ currency, onToggle, className }: CurrencyToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'rounded-full border border-border bg-surface-2 px-3 py-1.5 font-sans text-[13px] font-semibold text-text',
        className,
      )}
    >
      {currency}
    </button>
  )
}
