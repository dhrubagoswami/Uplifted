import { cn } from '../../lib/cn'

export interface TabItem {
  value: string
  label: string
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex w-fit gap-1 rounded-[10px] bg-surface-2 p-1', className)}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'rounded-[7px] px-[18px] py-2.5 font-sans text-[13.5px] font-semibold transition-colors',
              active ? 'bg-surface text-text' : 'text-text-2 hover:text-text',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
