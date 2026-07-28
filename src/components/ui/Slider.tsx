import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="range"
      className={cn('accent-primary h-1.5 w-full cursor-pointer', className)}
      {...props}
    />
  )
})
Slider.displayName = 'Slider'
