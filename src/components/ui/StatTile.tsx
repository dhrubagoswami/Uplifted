import type { ReactNode } from 'react'
import { Card } from './Card'
import { cn } from '../../lib/cn'

export interface StatTileProps {
  label: string
  value: ReactNode
  delta?: string
  deltaPositive?: boolean
  sparkline?: ReactNode
  className?: string
}

export function StatTile({ label, value, delta, deltaPositive, sparkline, className }: StatTileProps) {
  return (
    <Card padding="md" className={cn(className)}>
      <div className="font-sans text-[12.5px] text-text-2">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <div className="font-display text-2xl font-semibold text-text">{value}</div>
        {delta && (
          <div
            className={cn(
              'font-sans text-xs font-semibold',
              deltaPositive === false ? 'text-danger' : 'text-success',
            )}
          >
            {delta}
          </div>
        )}
      </div>
      {sparkline && <div className="mt-2">{sparkline}</div>}
    </Card>
  )
}
