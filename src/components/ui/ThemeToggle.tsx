import { Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ThemeToggleProps {
  dark: boolean
  onToggle: () => void
  className?: string
}

export function ThemeToggle({ dark, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-surface-2 text-text',
        className,
      )}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
