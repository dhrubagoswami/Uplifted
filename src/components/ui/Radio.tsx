import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type="radio"
        id={id}
        className={cn('accent-primary h-4 w-4 cursor-pointer', className)}
        {...props}
      />
    )
    if (!label) return input
    return (
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-2.5 font-sans text-[13.5px] text-text"
      >
        {input}
        {label}
      </label>
    )
  },
)
Radio.displayName = 'Radio'
