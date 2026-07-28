import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string
  src?: string
  size?: Size
  anonymous?: boolean
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-7 w-7 text-[12px]',
  md: 'h-8 w-8 text-[13px]',
  lg: 'h-[34px] w-[34px] text-[13px]',
}

export function Avatar({ name, src, size = 'md', anonymous, className, ...props }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? ''}
        className={cn('flex-shrink-0 rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full font-sans font-semibold',
        anonymous ? 'bg-accent' : 'bg-surface-2 text-primary',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {!anonymous && name ? name.charAt(0).toUpperCase() : null}
    </span>
  )
}
