import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none font-sans text-[14.5px] pl-3.5 pr-9 py-3 rounded-[10px] border bg-surface text-text',
            'focus:outline-none focus:ring-2 focus:ring-primary/40',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2',
            error ? 'border-danger' : 'border-border',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-2"
        />
      </div>
    )
  },
)
Select.displayName = 'Select'
