import { useState } from 'react'
import { useCurrency } from '../../hooks/useCurrency'
import { useDashboardKpis, useFunnel, useTopCampaigns, useRevenueSeries } from '../../hooks/useAnalytics'
import { useDonationTicker } from '../../hooks/useDonationTicker'
import { DonationTicker } from '../../components/campaign/DonationTicker'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { cn } from '../../lib/cn'
import type { RevenueRange } from '../../types'

const RANGES: RevenueRange[] = ['7d', '30d', '90d']

const ALERTS = [
  { color: '#D97706', text: '2 campaigns ending within 3 days' },
  { color: '#DC2626', text: 'Green Roots Collective verification expiring in 14 days' },
  { color: '#3F7A5C', text: 'Indiranagar Metro kiosk offline for 4 hours' },
]

function sparklinePoints(values: number[]): string {
  const w = 100
  const h = 28
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function revenueChartPoints(series: { amount: number }[]) {
  const w = 600
  const h = 180
  const max = Math.max(...series.map((s) => s.amount), 1)
  const pts = series.map((s, i) => {
    const x = (i / Math.max(1, series.length - 1)) * w
    const y = h - (s.amount / max) * (h - 10) - 5
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const line = pts.join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  return { line, area }
}

export default function AdminDashboard() {
  const { format } = useCurrency()
  const [range, setRange] = useState<RevenueRange>('30d')
  const kpisQuery = useDashboardKpis()
  const revenueQuery = useRevenueSeries(range)
  const funnelQuery = useFunnel()
  const topCampaignsQuery = useTopCampaigns(4)
  const tickerQuery = useDonationTicker(10)

  return (
    <div className="flex flex-col gap-5">
      {kpisQuery.isPending && (
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}
      {kpisQuery.isError && (
        <ErrorState title="Couldn't load dashboard stats" onRetry={() => kpisQuery.refetch()} />
      )}
      {kpisQuery.data && (
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { kpi: kpisQuery.data.totalRaised, isMoney: true },
              { kpi: kpisQuery.data.donors, isMoney: false },
              { kpi: kpisQuery.data.avgGift, isMoney: true },
              { kpi: kpisQuery.data.activeCampaigns, isMoney: false },
            ] as const
          ).map(({ kpi, isMoney }) => (
            <div key={kpi.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-sans text-[12.5px] text-text-2">{kpi.label}</div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <div className="font-display text-2xl font-semibold text-text">
                  {isMoney ? format(Number(kpi.value)) : Number(kpi.value).toLocaleString('en-IN')}
                </div>
                <div className={cn('font-sans text-xs font-semibold', kpi.deltaPositive ? 'text-success' : 'text-danger')}>
                  {kpi.delta}
                </div>
              </div>
              <svg width="100%" height="28" viewBox="0 0 100 28" preserveAspectRatio="none" className="mt-2">
                <polyline points={sparklinePoints(kpi.sparkline)} fill="none" stroke="var(--primary)" strokeWidth="2" />
              </svg>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-sans text-[15px] font-semibold text-text">Revenue</div>
            <div className="flex gap-1 rounded-lg bg-surface-2 p-[3px]">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 font-sans text-xs font-semibold',
                    range === r ? 'bg-surface text-text' : 'text-text-2',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {revenueQuery.isPending && <Skeleton className="h-[180px] w-full" />}
          {revenueQuery.isError && <ErrorState onRetry={() => revenueQuery.refetch()} />}
          {revenueQuery.data && revenueQuery.data.length > 0 && (
            <svg width="100%" height="180" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={revenueChartPoints(revenueQuery.data).area} fill="url(#rev-grad)" />
              <polyline
                points={revenueChartPoints(revenueQuery.data).line}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
            </svg>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5.5">
          <DonationTicker
            title="Live donation feed"
            donations={tickerQuery.data}
            isPending={tickerQuery.isPending}
            rowCount={5}
            maxHeight={340}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3.5 font-sans text-sm font-semibold text-text">Top campaigns</div>
          {topCampaignsQuery.isPending && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          )}
          {topCampaignsQuery.isError && <ErrorState onRetry={() => topCampaignsQuery.refetch()} />}
          {(topCampaignsQuery.data ?? []).map((c) => (
            <div key={c.id} className="flex justify-between border-b border-border py-2.5 last:border-b-0">
              <span className="min-w-0 truncate pr-2 font-sans text-[13px] text-text">{c.title}</span>
              <span className="flex-shrink-0 font-sans text-[13px] font-semibold text-text">
                {format(c.raised)}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3.5 font-sans text-sm font-semibold text-text">Funnel</div>
          {funnelQuery.isPending && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          )}
          {funnelQuery.isError && <ErrorState onRetry={() => funnelQuery.refetch()} />}
          {(funnelQuery.data ?? []).map((f) => (
            <div key={f.label} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between font-sans text-xs text-text-2">
                <span>{f.label}</span>
                <span className="font-semibold text-text">{f.value.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3.5 font-sans text-sm font-semibold text-text">Alerts</div>
          {ALERTS.map((a) => (
            <div key={a.text} className="flex gap-2.5 border-b border-border py-2.5 last:border-b-0">
              <span
                className="mt-1.5 h-[7px] w-[7px] flex-shrink-0 rounded-full"
                style={{ background: a.color }}
              />
              <span className="font-sans text-[12.5px] leading-relaxed text-text">{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
