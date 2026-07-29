import { useAdminCampaignsList } from '../../hooks/useAdminCampaigns'
import { useCurrency } from '../../hooks/useCurrency'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { Badge } from '../../components/ui/Badge'

// TODO(design): settlement history and bank account aren't backed by a real
// payouts endpoint (not in CLAUDE.md §5.3's API surface), so settlements
// are illustrative static data; balance is derived from real campaign totals.
const SETTLEMENTS = Array.from({ length: 8 }).map((_, i) => ({
  date: new Date(Date.now() - i * 7 * 86_400_000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }),
  amount: 180_000_00 + ((i * 37) % 900) * 100,
}))

export default function AdminPayouts() {
  const { format } = useCurrency()
  const campaignsQuery = useAdminCampaignsList()

  if (campaignsQuery.isPending) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (campaignsQuery.isError) {
    return <ErrorState title="Couldn't load payouts" onRetry={() => campaignsQuery.refetch()} />
  }

  const totalRaised = (campaignsQuery.data?.data ?? []).reduce((a, c) => a + c.raised, 0)
  const balance = Math.round(totalRaised * 0.08)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="font-sans text-[12.5px] text-text-2">Available balance</div>
          <div className="mt-1.5 font-display text-2xl font-semibold text-text">{format(balance)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="font-sans text-[12.5px] text-text-2">Next payout</div>
          <div className="mt-1.5 font-display text-xl font-semibold text-text">Aug 1, 2026</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="mb-2 font-sans text-[12.5px] text-text-2">Bank account</div>
          <div className="font-mono text-sm text-text">HDFC •••• 6172</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5.5">
        <div className="mb-3.5 font-sans text-sm font-semibold text-text">Settlement history</div>
        <div className="flex flex-col">
          {SETTLEMENTS.map((s) => (
            <div key={s.date} className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
              <span className="font-sans text-[13px] text-text-2">{s.date}</span>
              <span className="font-sans text-[13.5px] font-semibold text-text">{format(s.amount)}</span>
              <Badge variant="success">Settled</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
