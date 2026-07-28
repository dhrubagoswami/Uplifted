export interface DashboardKpi {
  label: string
  value: string
  delta: string
  deltaPositive: boolean
  sparkline: number[]
}

export interface DashboardKpis {
  totalRaised: DashboardKpi
  donors: DashboardKpi
  avgGift: DashboardKpi
  activeCampaigns: DashboardKpi
}

export interface RevenuePoint {
  date: string
  /** integer paise */
  amount: number
}

export type RevenueRange = '7d' | '30d' | '90d'

export interface ChannelSplitEntry {
  method: string
  /** integer paise */
  amount: number
  pct: number
}

export interface FunnelStage {
  label: string
  value: number
  pct: number
}

export interface TopCampaignEntry {
  id: string
  title: string
  /** integer paise */
  raised: number
}

export interface RetentionCohort {
  cohort: string
  retained: number[]
}
