import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full font-sans text-[14.5px] px-3.5 py-3 rounded-[10px] border bg-surface text-text placeholder:text-text-3',
          'focus:outline-none focus:ring-2 focus:ring-primary/40',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
