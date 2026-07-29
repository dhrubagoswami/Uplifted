import { Bell, Search } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Avatar } from './ui/Avatar'

export interface AdminTopbarProps {
  breadcrumb: string
}

export function AdminTopbar({ breadcrumb }: AdminTopbarProps) {
  const { user } = useAuth()
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('') ?? ''

  return (
    <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-surface px-7">
      <div className="font-sans text-[13.5px] text-text-2">
        Admin <span className="text-text">/</span>{' '}
        <span className="font-semibold text-text">{breadcrumb}</span>
      </div>
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2 rounded-[9px] border border-border bg-bg px-3 py-2">
          <Search size={14} className="text-text-2" />
          <span className="font-sans text-[13px] text-text-2">Search</span>
          <span className="ml-2 rounded bg-surface-2 px-[5px] py-0.5 font-mono text-[11px] text-text-2">
            ⌘K
          </span>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-[9px] border border-border bg-bg text-text"
        >
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-danger" />
        </button>
        <Avatar name={initials || undefined} size="lg" />
      </div>
    </div>
  )
}
