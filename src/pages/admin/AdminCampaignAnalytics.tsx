import { useParams } from 'react-router-dom'
import { useCampaignById } from '../../hooks/useCampaignById'
import { useDonationsByCampaign } from '../../hooks/useDonationsByCampaign'
import { useCurrency } from '../../hooks/useCurrency'
import { ProgressMeter } from '../../components/ui/ProgressMeter'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { timeAgo } from '../../lib/format'

const SOURCES = [
  { label: 'Web', pct: 52, color: '#3F7A5C' },
  { label: 'Kiosk', pct: 24, color: '#5B9E77' },
  { label: 'Social', pct: 16, color: '#7FBF8C' },
  { label: 'Email', pct: 8, color: '#8FCBA0' },
]

function donationTrendPoints(count: number): string {
  return Array.from({ length: 20 })
    .map((_, i) => {
      const x = (i * 500) / 19
      const y = 150 - Math.abs(Math.sin((i + count) / 2)) * 120 - 10
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export default function AdminCampaignAnalytics() {
  const { id } = useParams<{ id: string }>()
  const { format } = useCurrency()
  const campaignQuery = useCampaignById(id)
  const campaign = campaignQuery.data
  const donationsQuery = useDonationsByCampaign(campaign?.id)

  if (campaignQuery.isPending) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (campaignQuery.isError || !campaign) {
    return <ErrorState title="Campaign not found" onRetry={() => campaignQuery.refetch()} />
  }

  const donorRows = (donationsQuery.data ?? []).slice(0, 6)

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-surface p-5.5">
        <h1 className="mb-4 font-display text-[22px] font-semibold text-text">{campaign.title}</h1>
        <ProgressMeter
          goal={campaign.goal}
          raised={campaign.raised}
          unitCost={campaign.unitCost}
          unitLabel={campaign.impactUnit}
          daysLeft={campaign.daysLeft}
          completed={campaign.completed}
        />
      </div>

      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="mb-4 font-sans text-sm font-semibold text-text">Donations over time</div>
          <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
            <polyline points={donationTrendPoints(donorRows.length)} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="mb-3.5 font-sans text-sm font-semibold text-text">Source breakdown</div>
          {SOURCES.map((s) => (
            <div key={s.label} className="mb-2.5 last:mb-0">
              <div className="mb-1 flex justify-between font-sans text-xs text-text-2">
                <span>{s.label}</span>
                <span className="font-semibold text-text">{s.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5.5">
        <div className="mb-3.5 font-sans text-sm font-semibold text-text">Recent donors</div>
        {donationsQuery.isPending && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}
        {donationsQuery.isError && <ErrorState onRetry={() => donationsQuery.refetch()} />}
        {!donationsQuery.isPending && donorRows.length === 0 && (
          <EmptyState title="No donors yet" description="Donations for this campaign will appear here." />
        )}
        {donorRows.map((d) => (
          <div key={d.id} className="flex justify-between border-b border-border py-2.5 last:border-b-0">
            <span className="font-sans text-[13.5px] text-text">{d.donorName ?? 'Anonymous'}</span>
            <span className="font-sans text-[13px] text-text-2">
              {format(d.amount)} · {timeAgo(d.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
