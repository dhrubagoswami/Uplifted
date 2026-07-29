import { Fragment } from 'react'
import { useRevenueSeries, useChannelSplit, useRetention } from '../../hooks/useAnalytics'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

const CHANNEL_COLORS: Record<string, string> = {
  UPI: '#4F46E5',
  Card: '#7C3AED',
  'Net Banking': '#C026D3',
  Wallet: '#818CF8',
  PayPal: '#A78BFA',
}

// TODO(design): weekly new-vs-returning bars, average-gift trend, and
// geography breakdown aren't backed by real endpoints (not in CLAUDE.md
// §5.3's analytics surface), so they're shown as static illustrative content.
const WEEKLY_BARS = Array.from({ length: 8 }).map((_, i) => ({
  newH: 40 + (i % 3) * 20,
  retH: 30 + ((i + 2) % 4) * 15,
}))
const AVG_GIFT_POINTS = Array.from({ length: 16 })
  .map((_, i) => `${(i * 20).toFixed(1)},${(110 - 30 - Math.sin(i / 2) * 25 - i * 0.4).toFixed(1)}`)
  .join(' ')
const GEOGRAPHY = [
  { name: 'Karnataka', pct: 34 },
  { name: 'Maharashtra', pct: 22 },
  { name: 'Rajasthan', pct: 16 },
  { name: 'Kerala', pct: 14 },
  { name: 'Other states', pct: 14 },
]

function trendPoints(series: { amount: number }[]) {
  const max = Math.max(...series.map((s) => s.amount), 1)
  return series
    .map((s, i) => `${((i / Math.max(1, series.length - 1)) * 500).toFixed(1)},${(150 - (s.amount / max) * 140 - 5).toFixed(1)}`)
    .join(' ')
}

export default function AdminAnalytics() {
  const revenueQuery = useRevenueSeries('90d')
  const channelQuery = useChannelSplit()
  const retentionQuery = useRetention()

  const channels = (channelQuery.data ?? []).map((c) => ({ ...c, color: CHANNEL_COLORS[c.method] ?? '#818CF8' }))
  const donutStops = channels
    .reduce<{ stops: string[]; acc: number }>(
      (state, c) => {
        const start = state.acc
        const end = start + c.pct
        return { stops: [...state.stops, `${c.color} ${start}% ${end}%`], acc: end }
      },
      { stops: [], acc: 0 },
    )
    .stops.join(', ')

  return (
    <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-3">
      <div className="rounded-2xl border border-border bg-surface p-5.5 lg:col-span-2">
        <div className="mb-3.5 font-sans text-sm font-semibold text-text">Revenue trend</div>
        {revenueQuery.isPending && <Skeleton className="h-[150px] w-full" />}
        {revenueQuery.isError && <ErrorState onRetry={() => revenueQuery.refetch()} />}
        {revenueQuery.data && (
          <svg width="100%" height="150" viewBox="0 0 500 150" preserveAspectRatio="none">
            <polyline points={trendPoints(revenueQuery.data)} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
          </svg>
        )}
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-5.5">
        <div className="mb-3.5 self-start font-sans text-sm font-semibold text-text">Channel split</div>
        {channelQuery.isPending && <Skeleton className="h-[130px] w-[130px] rounded-full" />}
        {channelQuery.isError && <ErrorState onRetry={() => channelQuery.refetch()} />}
        {channels.length > 0 && (
          <>
            <div
              className="h-[130px] w-[130px] rounded-full"
              style={{ background: `conic-gradient(${donutStops})` }}
            />
            <div className="mt-3.5 flex w-full flex-col gap-1.5">
              {channels.map((c) => (
                <div key={c.method} className="flex justify-between font-sans text-xs">
                  <span className="flex items-center gap-1.5 text-text-2">
                    <span className="h-[7px] w-[7px] rounded-full" style={{ background: c.color }} />
                    {c.method}
                  </span>
                  <span className="font-semibold text-text">{c.pct}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5.5">
        <div className="mb-4 font-sans text-sm font-semibold text-text">New vs returning</div>
        <div className="flex h-[130px] items-end gap-2">
          {WEEKLY_BARS.map((w, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end gap-0.5">
              <div className="rounded-t-sm bg-primary" style={{ height: w.newH }} />
              <div className="rounded-b-sm bg-surface-2" style={{ height: w.retH }} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5.5">
        <div className="mb-4 font-sans text-sm font-semibold text-text">Average gift over time</div>
        <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
          <polyline points={AVG_GIFT_POINTS} fill="none" stroke="var(--primary)" strokeWidth="2" />
        </svg>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5.5">
        <div className="mb-3.5 font-sans text-sm font-semibold text-text">Geography</div>
        {GEOGRAPHY.map((g) => (
          <div key={g.name} className="mb-2 last:mb-0">
            <div className="mb-0.5 flex justify-between font-sans text-xs text-text-2">
              <span>{g.name}</span>
              <span className="font-semibold text-text">{g.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-primary" style={{ width: `${g.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5.5 lg:col-span-3">
        <div className="mb-3.5 font-sans text-sm font-semibold text-text">Retention cohorts</div>
        {retentionQuery.isPending && <Skeleton className="h-32 w-full" />}
        {retentionQuery.isError && <ErrorState onRetry={() => retentionQuery.refetch()} />}
        {retentionQuery.data && (
          <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1">
            {retentionQuery.data.map((row) => (
              <Fragment key={row.cohort}>
                <div className="flex items-center font-sans text-[11.5px] text-text-2">{row.cohort}</div>
                {Array.from({ length: 6 }).map((_, ci) => {
                  const val = row.retained[ci]
                  return (
                    <div
                      key={ci}
                      className="flex aspect-[2/1] items-center justify-center rounded-md font-sans text-[11px] font-semibold"
                      style={{
                        background:
                          val === undefined
                            ? 'var(--surface-2)'
                            : `rgba(79,70,229,${0.1 + (val / 100) * 0.6})`,
                        color: val !== undefined && val > 60 ? '#fff' : 'var(--text)',
                      }}
                    >
                      {val !== undefined ? `${val}%` : ''}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
