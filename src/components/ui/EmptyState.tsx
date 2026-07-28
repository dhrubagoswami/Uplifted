import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center',
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-text-2">
        {icon ?? <Inbox size={20} />}
      </div>
      <div className="font-display text-base font-semibold text-text">{title}</div>
      {description && <p className="max-w-sm font-sans text-sm text-text-2">{description}</p>}
      {action}
    </div>
  )
}
