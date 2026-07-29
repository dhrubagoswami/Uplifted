import type { Donation } from '../../types'
import { useCurrency } from '../../hooks/useCurrency'
import { timeAgo } from '../../lib/format'
import { Avatar } from '../ui/Avatar'
import { Skeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'

export interface DonationTickerProps {
  title?: string
  donations?: Donation[]
  isPending?: boolean
  rowCount?: number
  maxHeight?: number
}

export function DonationTicker({
  title = 'Live giving',
  donations,
  isPending,
  rowCount = 6,
  maxHeight = 360,
}: DonationTickerProps) {
  const { format } = useCurrency()
  const rows = (donations ?? []).slice(0, rowCount)

  return (
    <div className="flex w-full flex-col gap-2.5" aria-live="polite">
      {title && (
        <div className="mb-1 flex items-center gap-2">
          <span className="h-[7px] w-[7px] rounded-full bg-success shadow-[0_0_0_3px_rgba(5,150,105,0.18)]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-2">
            {title}
          </span>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: Math.min(rowCount, 4) }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      )}

      {!isPending && rows.length === 0 && (
        <EmptyState title="No gifts yet" description="Recent donations will appear here." />
      )}

      {!isPending && rows.length > 0 && (
        <div
          className="flex flex-col gap-px overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]"
          style={{ maxHeight }}
        >
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2.5 border-b border-border/60 px-1 py-2.5">
              <Avatar name={row.donorName ?? undefined} anonymous={!row.donorName} size="md" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[13.5px] text-text">
                  <span className="font-semibold">{row.donorName ?? 'Anonymous'}</span> ·{' '}
                  <span className="font-semibold tabular-nums">{format(row.amount)}</span> ·{' '}
                  {row.unitLabel}
                </div>
                <div className="truncate font-sans text-xs text-text-3">
                  {row.campaignTitle} · {timeAgo(row.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
