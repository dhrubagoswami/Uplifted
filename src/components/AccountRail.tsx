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
    <div className="flex flex-shrink-0 flex-col gap-1 border-b border-border bg-surface-2/40 p-3 lg:min-h-screen lg:w-[220px] lg:border-b-0 lg:border-r">
      <div className="mb-1 flex items-center justify-between gap-2.5 px-1 py-1 lg:mb-5 lg:flex-col lg:items-stretch lg:px-2 lg:py-0">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2 no-underline">
          <span className="h-6 w-6 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3]" />
          <span className="font-display text-[15px] font-bold text-text">Uplifted</span>
        </Link>
        <div className="flex items-center gap-2 px-1 lg:hidden">
          <Avatar name={user?.name} size="sm" />
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

      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[10px] px-3 py-2.5 font-sans text-sm font-medium no-underline',
                active ? 'bg-surface-2 text-primary' : 'text-text-2 hover:text-text',
              )}
            >
              <span className={cn('h-2 w-2 flex-shrink-0 rounded-sm', active ? 'bg-primary' : 'bg-text-2')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto hidden items-center gap-2.5 p-3 lg:flex">
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
