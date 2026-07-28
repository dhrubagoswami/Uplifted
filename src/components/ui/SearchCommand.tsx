import { Search, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SearchCommandProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function SearchCommand({
  value,
  onChange,
  placeholder = 'Search campaigns and organizations',
  autoFocus,
  className,
}: SearchCommandProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3',
        'focus-within:ring-2 focus-within:ring-primary/40',
        className,
      )}
    >
      <Search size={18} className="flex-shrink-0 text-text-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent font-sans text-sm text-text placeholder:text-text-3 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="flex-shrink-0 text-text-2 hover:text-text"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
