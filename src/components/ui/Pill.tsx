import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  ({ active = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-[18px] py-2.5 font-sans text-sm font-medium transition-colors',
          active
            ? 'border-primary bg-surface text-text'
            : 'border-border bg-transparent text-text-2 hover:bg-surface-2',
          className,
        )}
        {...props}
      />
    )
  },
)
Pill.displayName = 'Pill'
