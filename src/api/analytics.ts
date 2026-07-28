import { db } from '../mocks/db'
import { generateRevenueSeries } from '../mocks/seed/analytics'
import type {
  ChannelSplitEntry,
  DashboardKpis,
  FunnelStage,
  RetentionCohort,
  RevenuePoint,
  RevenueRange,
  TopCampaignEntry,
} from '../types'
import { delay } from './client'

function sparkline(seed: number): number[] {
  return Array.from({ length: 12 }).map((_, i) => 10 + Math.sin(i + seed) * 8 + i * 0.6)
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  await delay()
  const totalRaised = db.campaigns.reduce((a, c) => a + c.raised, 0)
  const totalDonors = db.campaigns.reduce((a, c) => a + c.donorCount, 0)
  const activeCampaigns = db.campaigns.filter((c) => c.status !== 'completed').length

  return {
    totalRaised: { label: 'Total raised', value: String(totalRaised), delta: '+12.4%', deltaPositive: true, sparkline: sparkline(1) },
    donors: { label: 'Donors', value: String(totalDonors), delta: '+8.1%', deltaPositive: true, sparkline: sparkline(2) },
    avgGift: {
      label: 'Avg. gift',
      value: String(Math.round(totalRaised / Math.max(1, totalDonors))),
      delta: '+2.3%',
      deltaPositive: true,
      sparkline: sparkline(3),
    },
    activeCampaigns: {
      label: 'Active campaigns',
      value: String(activeCampaigns),
      delta: '-1',
      deltaPositive: false,
      sparkline: sparkline(4),
    },
  }
}

export async function getRevenueSeries(range: RevenueRange = '30d'): Promise<RevenuePoint[]> {
  await delay()
  const rangeDays: Record<RevenueRange, number> = { '7d': 7, '30d': 30, '90d': 90 }
  return generateRevenueSeries().slice(-rangeDays[range])
}

export async function getChannelSplit(): Promise<ChannelSplitEntry[]> {
  await delay()
  const totals = new Map<string, number>()
  for (const d of db.donations) {
    totals.set(d.method, (totals.get(d.method) ?? 0) + d.amount)
  }
  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0) || 1
  return Array.from(totals.entries()).map(([method, amount]) => ({
    method,
    amount,
    pct: Math.round((amount / grandTotal) * 100),
  }))
}

export async function getFunnel(): Promise<FunnelStage[]> {
  await delay()
  return [
    { label: 'Viewed campaign', value: 48200, pct: 100 },
    { label: 'Started donation', value: 9640, pct: 20 },
    { label: 'Completed gift', value: 6180, pct: 13 },
  ]
}

export async function getTopCampaigns(n = 5): Promise<TopCampaignEntry[]> {
  await delay()
  return db.campaigns
    .slice()
    .sort((a, b) => b.raised - a.raised)
    .slice(0, n)
    .map((c) => ({ id: c.id, title: c.title, raised: c.raised }))
}

export async function getRetention(): Promise<RetentionCohort[]> {
  await delay()
  return [
    { cohort: 'Jan 2026', retained: [100, 62, 48, 41, 37, 34] },
    { cohort: 'Feb 2026', retained: [100, 58, 45, 39, 35] },
    { cohort: 'Mar 2026', retained: [100, 64, 51, 44] },
  ]
}
