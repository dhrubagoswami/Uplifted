import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface FilterBarProps {
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function FilterBar({ children, actions, className }: FilterBarProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center justify-between gap-3', className)}>
      <div className="flex flex-wrap gap-2">{children}</div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
