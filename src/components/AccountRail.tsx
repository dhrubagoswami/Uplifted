import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Avatar } from './ui/Avatar'
import { cn } from '../lib/cn'

const NAV_ITEMS = [
  { label: 'Overview', href: '/account' },
  { label: 'Donations', href: '/account/donations' },
  { label: 'Recurring', href: '/account/recurring' },
  { label: 'Saved', href: '/account/saved' },
  { label: 'Settings', href: '/account/settings' },
]

export function AccountRail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen w-[220px] flex-shrink-0 flex-col gap-1 border-r border-border bg-surface-2/40 p-3">
      <Link
        to="/"
        className="mb-5 flex items-center gap-2.5 px-3 py-2 no-underline"
      >
        <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3]" />
        <span className="font-display text-[15px] font-bold text-text">Uplifted</span>
      </Link>

      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.href
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 font-sans text-sm font-medium no-underline',
              active ? 'bg-surface-2 text-primary' : 'text-text-2 hover:text-text',
            )}
          >
            <span className={cn('h-2 w-2 flex-shrink-0 rounded-sm', active ? 'bg-primary' : 'bg-text-2')} />
            {item.label}
          </Link>
        )
      })}

      <div className="mt-auto flex items-center gap-2.5 p-3">
        <Avatar name={user?.name} size="md" />
        <div>
          <div className="font-sans text-[13px] font-semibold text-text">{user?.name}</div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="font-sans text-xs text-text-2 hover:text-text"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
