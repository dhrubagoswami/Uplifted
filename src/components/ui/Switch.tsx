import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
  return (
    <label className={cn('relative inline-flex h-6 w-11 cursor-pointer items-center', className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span
        className={cn(
          'absolute inset-0 rounded-full transition-colors duration-200',
          'bg-surface-2 border border-border peer-checked:bg-primary peer-checked:border-primary',
        )}
      />
      <span
        className={cn(
          'absolute left-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200',
          'peer-checked:translate-x-[20px]',
        )}
      />
    </label>
  )
})
Switch.displayName = 'Switch'
