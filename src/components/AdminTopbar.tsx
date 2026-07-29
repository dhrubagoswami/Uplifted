import { Bell, Menu, Search } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Avatar } from './ui/Avatar'

export interface AdminTopbarProps {
  breadcrumb: string
  onOpenNav?: () => void
}

export function AdminTopbar({ breadcrumb, onOpenNav }: AdminTopbarProps) {
  const { user } = useAuth()
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('') ?? ''

  return (
    <div className="flex h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenNav}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] border border-border bg-bg text-text lg:hidden"
        >
          <Menu size={16} />
        </button>
        <div className="truncate font-sans text-[13.5px] text-text-2">
          Admin <span className="text-text">/</span>{' '}
          <span className="font-semibold text-text">{breadcrumb}</span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3.5">
        <div className="hidden items-center gap-2 rounded-[9px] border border-border bg-bg px-3 py-2 md:flex">
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
