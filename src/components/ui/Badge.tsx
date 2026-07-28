import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'solid' | 'soft' | 'danger' | 'success'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
  /** Overrides variant background/text with an explicit color (e.g. category color). */
  color?: string
}

const variantClasses: Record<Variant, string> = {
  solid: 'bg-primary text-white',
  soft: 'bg-surface-2 text-text-2',
  danger: 'bg-danger text-white',
  success: 'bg-success-soft text-success',
}

export function Badge({ variant = 'solid', color, className, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] font-sans text-[11px] font-semibold tracking-[0.03em]',
        !color && variantClasses[variant],
        className,
      )}
      style={color ? { background: color, color: '#fff', ...style } : style}
      {...props}
    >
      {children}
    </span>
  )
}
