import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] shadow-[0_8px_32px_rgba(79,70,229,.28)] hover:-translate-y-px hover:shadow-[0_12px_36px_rgba(79,70,229,.36)]',
  secondary: 'text-text bg-surface border border-border hover:bg-surface-2',
  ghost: 'text-text-2 hover:bg-surface-2 hover:text-text',
  danger: 'text-white bg-danger hover:brightness-110',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-[13.5px] px-4 py-2 rounded-lg',
  md: 'text-[15.5px] px-[26px] py-[15px] rounded-xl',
  lg: 'text-[16px] px-8 py-4 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
