import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCurrency } from '../hooks/useCurrency'
import { ThemeToggle } from './ui/ThemeToggle'
import { CurrencyToggle } from './ui/CurrencyToggle'
import { Drawer } from './ui/Drawer'
import { cn } from '../lib/cn'

export interface SiteHeaderProps {
  heroMode?: boolean
}

const NAV_ITEMS = [
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
]

export function SiteHeader({ heroMode = false }: SiteHeaderProps) {
  const { dark, toggleDark } = useTheme()
  const { currency, toggleCurrency } = useCurrency()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(() => !heroMode || window.scrollY > 80)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!heroMode) return
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroMode])

  const transparent = heroMode && !scrolled

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-200',
        transparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-border bg-bg/85 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:gap-6 lg:px-12">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2.5 no-underline">
          <span className="h-[30px] w-[30px] flex-shrink-0 rounded-[9px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3]" />
          <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-text">
            Uplifted
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'whitespace-nowrap font-sans text-[14.5px] font-medium no-underline hover:text-text',
                  active ? 'text-primary' : 'text-text-2',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden flex-shrink-0 items-center gap-3.5 lg:flex">
          <Link
            to="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-text-2 no-underline hover:bg-surface-2"
          >
            <Search size={18} />
          </Link>
          <CurrencyToggle currency={currency} onToggle={toggleCurrency} />
          <ThemeToggle dark={dark} onToggle={toggleDark} />
          <Link
            to="/login"
            className="px-1 py-2.5 font-sans text-[14.5px] font-medium text-text no-underline hover:text-primary"
          >
            Sign in
          </Link>
          <Link
            to="/campaigns"
            className="rounded-[10px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] px-5 py-2.5 font-sans text-[14.5px] font-semibold text-white no-underline shadow-[0_8px_32px_rgba(79,70,229,.28)] transition-transform hover:-translate-y-px"
          >
            Donate now
          </Link>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 lg:hidden">
          <Link
            to="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-text-2 no-underline hover:bg-surface-2"
          >
            <Search size={18} />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-text-2 hover:bg-surface-2"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-text">Uplifted</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-text-2 hover:bg-surface-2"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-3 font-sans text-[15px] font-medium no-underline',
                  active ? 'bg-surface-2 text-primary' : 'text-text-2 hover:bg-surface-2 hover:text-text',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <CurrencyToggle currency={currency} onToggle={toggleCurrency} />
          <ThemeToggle dark={dark} onToggle={toggleDark} />
        </div>
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="rounded-[10px] border border-border px-4 py-3 text-center font-sans text-[15px] font-medium text-text no-underline"
        >
          Sign in
        </Link>
        <Link
          to="/campaigns"
          onClick={() => setMenuOpen(false)}
          className="mt-auto rounded-[10px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3] px-5 py-3.5 text-center font-sans text-[15px] font-semibold text-white no-underline"
        >
          Donate now
        </Link>
      </Drawer>
    </header>
  )
}
