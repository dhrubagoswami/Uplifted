import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Logo } from './ui/Logo'
import { cn } from '../lib/cn'

interface NavGroup {
  label: string
  items: { label: string; href: string }[]
}

const GROUPS: NavGroup[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', href: '/admin' }] },
  {
    label: 'Fundraising',
    items: [
      { label: 'Campaigns', href: '/admin/campaigns' },
      { label: 'Kiosks', href: '/admin/kiosks' },
    ],
  },
  { label: 'People', items: [{ label: 'Donors', href: '/admin/donors' }] },
  {
    label: 'Finance',
    items: [
      { label: 'Donations', href: '/admin/donations' },
      { label: 'Analytics', href: '/admin/analytics' },
      { label: 'Payouts', href: '/admin/payouts' },
    ],
  },
  { label: 'Settings', items: [{ label: 'Settings', href: '/admin/settings' }] },
]

export interface AdminRailProps {
  /** Renders as a static block without the collapse toggle, for use inside a mobile Drawer. */
  variant?: 'sidebar' | 'drawer'
  onNavigate?: () => void
}

export function AdminRail({ variant = 'sidebar', onNavigate }: AdminRailProps) {
  const [expanded, setExpanded] = useState(true)
  const location = useLocation()
  const { user } = useAuth()
  const org = user?.role === 'admin' ? user.org : ''
  const isDrawer = variant === 'drawer'
  const showLabels = isDrawer || expanded

  return (
    <div
      className={cn(
        'flex flex-shrink-0 flex-col border-border bg-surface-2/40',
        isDrawer
          ? 'w-full'
          : cn(
              'hidden min-h-screen border-r transition-[width] duration-200 lg:flex',
              expanded ? 'w-[240px]' : 'w-16',
            ),
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-[18px]">
        <Logo size={28} />
        {showLabels && (
          <div className="min-w-0">
            <div className="truncate font-sans text-[13.5px] font-semibold text-text">{org}</div>
            <div className="font-sans text-[11.5px] text-text-2">Org admin</div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-2.5">
        {GROUPS.map((group) => (
          <div key={group.label}>
            {showLabels && (
              <div className="px-2.5 pb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-text-2">
                {group.label}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 font-sans text-[13.5px] font-medium no-underline',
                      active ? 'bg-accent-soft text-primary' : 'text-text-2 hover:text-text',
                    )}
                  >
                    <span
                      className={cn(
                        'h-[7px] w-[7px] flex-shrink-0 rounded-sm',
                        active ? 'bg-primary' : 'bg-text-2',
                      )}
                    />
                    {showLabels && <span className="truncate">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {!isDrawer && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="m-2.5 rounded-[9px] border border-border px-2.5 py-2.5 font-sans text-xs text-text-2"
        >
          {expanded ? '← Collapse' : '→'}
        </button>
      )}
    </div>
  )
}
